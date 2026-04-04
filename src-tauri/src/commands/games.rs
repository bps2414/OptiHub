use std::collections::{BTreeMap, BTreeSet};
use std::fs;
use std::path::{Path, PathBuf};
use std::time::{SystemTime, UNIX_EPOCH};

use keyvalues_serde::from_str_with_key;
use rusqlite::{Connection, params};
use serde::{Deserialize, Serialize};
use tauri::Manager;
use winreg::RegKey;
use winreg::enums::{HKEY_CURRENT_USER, HKEY_LOCAL_MACHINE};

use crate::errors::AppError;

const MANUAL_REGISTRATION_TABLE: &str = "manual_game_registrations";

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum GameSource {
    Steam,
    Manual,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GameLibraryEntry {
    pub id: String,
    pub display_name: String,
    pub executable_path: Option<String>,
    pub install_dir: String,
    pub source: GameSource,
    pub steam_app_id: Option<u32>,
    pub removable: bool,
    pub user_added: bool,
    pub last_seen_at: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GameLibrarySnapshot {
    pub entries: Vec<GameLibraryEntry>,
    pub steam_library_paths: Vec<String>,
    pub scanned_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ManualGameRegistrationInput {
    pub display_name: String,
    pub executable_path: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
struct SteamScanEntry {
    app_id: u32,
    display_name: String,
    install_dir: PathBuf,
    normalized_install_root: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
struct SteamScanSnapshot {
    entries: Vec<SteamScanEntry>,
    steam_library_paths: Vec<String>,
    scanned_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
struct ManualGameRegistration {
    id: String,
    display_name: String,
    executable_path: String,
    normalized_executable_path: String,
    install_dir: String,
    normalized_install_root: String,
    created_at: String,
    updated_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
struct LibraryFolderEntry {
    path: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(untagged)]
enum LibraryFolderValue {
    Path(String),
    Entry(LibraryFolderEntry),
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
struct AppManifest {
    appid: Option<String>,
    name: Option<String>,
    installdir: Option<String>,
}

fn normalize_optional_string(value: Option<&str>) -> Option<String> {
    value
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(ToOwned::to_owned)
}

fn now_timestamp() -> String {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|value| value.as_secs().to_string())
        .unwrap_or_else(|_| "0".into())
}

fn normalize_path_string(path: &Path) -> String {
    let candidate = path.canonicalize().unwrap_or_else(|_| path.to_path_buf());
    let normalized = candidate
        .to_string_lossy()
        .replace('\\', "/")
        .trim_end_matches('/')
        .to_string();

    if cfg!(windows) {
        normalized.to_ascii_lowercase()
    } else {
        normalized
    }
}

fn normalize_install_root(path: &Path) -> String {
    normalize_path_string(path)
}

fn normalize_executable_path(path: &Path) -> String {
    normalize_path_string(path)
}

fn derive_install_root_from_executable(executable_path: &Path) -> PathBuf {
    let mut current = executable_path
        .parent()
        .map(Path::to_path_buf)
        .unwrap_or_else(|| executable_path.to_path_buf());

    loop {
        let should_strip = current
            .file_name()
            .and_then(|value| value.to_str())
            .map(|value| {
                matches!(
                    value.to_ascii_lowercase().as_str(),
                    "bin" | "binaries" | "game" | "shipping" | "win64" | "win32" | "x64"
                        | "x86"
                )
            })
            .unwrap_or(false);

        if !should_strip {
            break;
        }

        if let Some(parent) = current.parent() {
            current = parent.to_path_buf();
        } else {
            break;
        }
    }

    current
}

fn app_database_path(app: &tauri::AppHandle) -> Result<PathBuf, AppError> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|error| AppError::SystemError(error.to_string()))?;

    fs::create_dir_all(&app_data_dir).map_err(|error| AppError::SystemError(error.to_string()))?;

    Ok(app_data_dir.join("optihub.sqlite3"))
}

fn open_database(database_path: &Path) -> Result<Connection, AppError> {
    Connection::open(database_path).map_err(|error| AppError::SystemError(error.to_string()))
}

fn ensure_manual_registration_table(connection: &Connection) -> Result<(), AppError> {
    connection
        .execute_batch(&format!(
            r#"
CREATE TABLE IF NOT EXISTS {MANUAL_REGISTRATION_TABLE} (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  executable_path TEXT NOT NULL,
  normalized_executable_path TEXT NOT NULL UNIQUE,
  install_dir TEXT NOT NULL,
  normalized_install_root TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_manual_game_registrations_install_root
ON {MANUAL_REGISTRATION_TABLE}(normalized_install_root);
"#
        ))
        .map_err(|error| AppError::SystemError(error.to_string()))
}

fn generate_manual_registration_id(normalized_executable_path: &str) -> String {
    format!(
        "manual-{}",
        normalized_executable_path
            .replace(':', "-")
            .replace('/', "-")
            .replace('.', "-")
    )
}

fn validate_manual_input(input: &ManualGameRegistrationInput) -> Result<(PathBuf, PathBuf), AppError> {
    let executable_path = PathBuf::from(input.executable_path.trim());
    executable_path.parent().ok_or_else(|| {
        AppError::InvalidInput("Manual executable path must have a parent directory".into())
    })?;
    let install_root = derive_install_root_from_executable(&executable_path);

    if input.display_name.trim().is_empty() {
        return Err(AppError::InvalidInput(
            "Manual display name must not be empty".into(),
        ));
    }

    if executable_path
        .extension()
        .and_then(|value| value.to_str())
        .map(|value| !value.eq_ignore_ascii_case("exe"))
        .unwrap_or(true)
    {
        return Err(AppError::InvalidInput(
            "Manual game registration requires a .exe path".into(),
        ));
    }

    Ok((executable_path, install_root))
}

fn insert_manual_registration(
    connection: &Connection,
    input: &ManualGameRegistrationInput,
    now: &str,
) -> Result<ManualGameRegistration, AppError> {
    let (executable_path, install_root) = validate_manual_input(input)?;
    let normalized_executable_path = normalize_executable_path(&executable_path);
    let normalized_install_root = normalize_install_root(&install_root);
    let record = ManualGameRegistration {
        id: generate_manual_registration_id(&normalized_executable_path),
        display_name: input.display_name.trim().to_string(),
        executable_path: executable_path.to_string_lossy().to_string(),
        normalized_executable_path,
        install_dir: install_root.to_string_lossy().to_string(),
        normalized_install_root,
        created_at: now.to_string(),
        updated_at: now.to_string(),
    };

    connection
        .execute(
            &format!(
                "INSERT INTO {MANUAL_REGISTRATION_TABLE} (
                    id,
                    display_name,
                    executable_path,
                    normalized_executable_path,
                    install_dir,
                    normalized_install_root,
                    created_at,
                    updated_at
                ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)"
            ),
            params![
                record.id,
                record.display_name,
                record.executable_path,
                record.normalized_executable_path,
                record.install_dir,
                record.normalized_install_root,
                record.created_at,
                record.updated_at,
            ],
        )
        .map_err(|error| AppError::InvalidInput(error.to_string()))?;

    Ok(record)
}

fn delete_manual_registration(connection: &Connection, game_id: &str) -> Result<(), AppError> {
    let internal_id = game_id.strip_prefix("manual:").unwrap_or(game_id);

    connection
        .execute(
            &format!("DELETE FROM {MANUAL_REGISTRATION_TABLE} WHERE id = ?1"),
            params![internal_id],
        )
        .map_err(|error| AppError::SystemError(error.to_string()))?;

    Ok(())
}

fn load_manual_registrations(connection: &Connection) -> Result<Vec<ManualGameRegistration>, AppError> {
    let mut statement = connection
        .prepare(&format!(
            "SELECT
                id,
                display_name,
                executable_path,
                normalized_executable_path,
                install_dir,
                normalized_install_root,
                created_at,
                updated_at
             FROM {MANUAL_REGISTRATION_TABLE}
             ORDER BY display_name COLLATE NOCASE, id"
        ))
        .map_err(|error| AppError::SystemError(error.to_string()))?;

    let rows = statement
        .query_map([], |row| {
            Ok(ManualGameRegistration {
                id: row.get(0)?,
                display_name: row.get(1)?,
                executable_path: row.get(2)?,
                normalized_executable_path: row.get(3)?,
                install_dir: row.get(4)?,
                normalized_install_root: row.get(5)?,
                created_at: row.get(6)?,
                updated_at: row.get(7)?,
            })
        })
        .map_err(|error| AppError::SystemError(error.to_string()))?;

    rows.collect::<Result<Vec<_>, _>>()
        .map_err(|error| AppError::SystemError(error.to_string()))
}

fn get_steam_root() -> Option<PathBuf> {
    let current_user = RegKey::predef(HKEY_CURRENT_USER);
    if let Ok(key) = current_user.open_subkey("Software\\Valve\\Steam") {
        if let Ok(value) = key.get_value::<String, _>("SteamPath") {
            return Some(PathBuf::from(value));
        }
    }

    let local_machine = RegKey::predef(HKEY_LOCAL_MACHINE);
    if let Ok(key) = local_machine.open_subkey("SOFTWARE\\WOW6432Node\\Valve\\Steam") {
        if let Ok(value) = key.get_value::<String, _>("InstallPath") {
            return Some(PathBuf::from(value));
        }
    }

    None
}

fn parse_libraryfolders_vdf(contents: &str) -> Result<Vec<PathBuf>, keyvalues_serde::Error> {
    let (folders, _root_key): (BTreeMap<String, LibraryFolderValue>, _) =
        from_str_with_key(contents)?;

    let mut paths = Vec::new();

    for (key, value) in folders {
        if !key.chars().all(|value| value.is_ascii_digit()) {
            continue;
        }

        let maybe_path = match value {
            LibraryFolderValue::Path(path) => Some(path),
            LibraryFolderValue::Entry(entry) => entry.path,
        };

        if let Some(path) = normalize_optional_string(maybe_path.as_deref()) {
            paths.push(PathBuf::from(path));
        }
    }

    Ok(paths)
}

fn parse_app_manifest(contents: &str) -> Result<AppManifest, keyvalues_serde::Error> {
    let (manifest, _root_key): (AppManifest, _) = from_str_with_key(contents)?;
    Ok(manifest)
}

fn parse_app_id(value: Option<&str>) -> Option<u32> {
    value?.trim().parse::<u32>().ok()
}

fn read_manifest_entry(library_path: &Path, manifest_path: &Path) -> Option<SteamScanEntry> {
    let contents = fs::read_to_string(manifest_path).ok()?;
    let manifest = parse_app_manifest(&contents).ok()?;
    let app_id = parse_app_id(manifest.appid.as_deref())?;
    let display_name = normalize_optional_string(manifest.name.as_deref())?;
    let install_dir_name = normalize_optional_string(manifest.installdir.as_deref())?;
    let install_dir = library_path
        .join("steamapps")
        .join("common")
        .join(&install_dir_name);

    Some(SteamScanEntry {
        app_id,
        display_name,
        normalized_install_root: normalize_install_root(&install_dir),
        install_dir,
    })
}

fn scan_library_manifests(library_path: &Path) -> Vec<SteamScanEntry> {
    let steamapps_dir = library_path.join("steamapps");
    let read_dir = match fs::read_dir(&steamapps_dir) {
        Ok(read_dir) => read_dir,
        Err(_) => return Vec::new(),
    };

    read_dir
        .filter_map(|entry| entry.ok())
        .map(|entry| entry.path())
        .filter(|path| {
            path.file_name()
                .and_then(|value| value.to_str())
                .map(|value| value.starts_with("appmanifest_") && value.ends_with(".acf"))
                .unwrap_or(false)
        })
        .filter_map(|path| read_manifest_entry(library_path, &path))
        .collect()
}

fn scan_steam_snapshot() -> SteamScanSnapshot {
    let scanned_at = now_timestamp();
    let steam_root = match get_steam_root() {
        Some(path) => path,
        None => {
            return SteamScanSnapshot {
                entries: Vec::new(),
                steam_library_paths: Vec::new(),
                scanned_at,
            };
        }
    };

    let libraryfolders_path = steam_root.join("steamapps").join("libraryfolders.vdf");
    let libraryfolders_contents = fs::read_to_string(&libraryfolders_path).ok();

    let mut library_paths = vec![steam_root.clone()];
    if let Some(contents) = libraryfolders_contents {
        if let Ok(extra_paths) = parse_libraryfolders_vdf(&contents) {
            library_paths.extend(extra_paths);
        }
    }

    let mut unique_library_paths = Vec::new();
    let mut seen_library_paths = BTreeSet::new();

    for path in library_paths {
        let normalized = normalize_install_root(&path);
        if seen_library_paths.insert(normalized) {
            unique_library_paths.push(path);
        }
    }

    let mut scan_entries = Vec::new();
    for library_path in &unique_library_paths {
        scan_entries.extend(scan_library_manifests(library_path));
    }

    let mut seen_app_ids = BTreeSet::new();
    let mut seen_install_roots = BTreeSet::new();
    scan_entries.retain(|entry| {
        seen_app_ids.insert(entry.app_id)
            && seen_install_roots.insert(entry.normalized_install_root.clone())
    });

    SteamScanSnapshot {
        entries: scan_entries,
        steam_library_paths: unique_library_paths
            .into_iter()
            .map(|path| path.to_string_lossy().to_string())
            .collect(),
        scanned_at,
    }
}

fn build_steam_entry(
    steam_entry: &SteamScanEntry,
    scanned_at: &str,
    manual_registration: Option<&ManualGameRegistration>,
) -> GameLibraryEntry {
    GameLibraryEntry {
        id: format!("steam:{}", steam_entry.app_id),
        display_name: steam_entry.display_name.clone(),
        executable_path: manual_registration.map(|registration| registration.executable_path.clone()),
        install_dir: steam_entry.install_dir.to_string_lossy().to_string(),
        source: GameSource::Steam,
        steam_app_id: Some(steam_entry.app_id),
        removable: false,
        user_added: manual_registration.is_some(),
        last_seen_at: Some(scanned_at.to_string()),
    }
}

fn build_manual_entry(registration: &ManualGameRegistration) -> GameLibraryEntry {
    GameLibraryEntry {
        id: format!("manual:{}", registration.id),
        display_name: registration.display_name.clone(),
        executable_path: Some(registration.executable_path.clone()),
        install_dir: registration.install_dir.clone(),
        source: GameSource::Manual,
        steam_app_id: None,
        removable: true,
        user_added: true,
        last_seen_at: Some(registration.updated_at.clone()),
    }
}

// Steam-side authoritative match key in Phase 3 = normalized install root.
// manual/manual duplicate prevention = normalized executable path.
// executable-path matching between Steam and manual rows is a future enhancement only,
// because Steam rows do not reliably know their `.exe` yet.
fn reconcile_library(
    steam_snapshot: SteamScanSnapshot,
    manual_registrations: Vec<ManualGameRegistration>,
) -> GameLibrarySnapshot {
    let mut matched_manual_ids = BTreeSet::new();
    let mut manual_by_install_root: BTreeMap<String, &ManualGameRegistration> = BTreeMap::new();

    for registration in &manual_registrations {
        manual_by_install_root
            .entry(registration.normalized_install_root.clone())
            .or_insert(registration);
    }

    let mut entries = Vec::new();
    for steam_entry in &steam_snapshot.entries {
        let manual_registration = manual_by_install_root.get(&steam_entry.normalized_install_root).copied();
        if let Some(registration) = manual_registration {
            matched_manual_ids.insert(registration.id.clone());
        }

        entries.push(build_steam_entry(
            steam_entry,
            &steam_snapshot.scanned_at,
            manual_registration,
        ));
    }

    for registration in manual_registrations {
        if matched_manual_ids.contains(&registration.id) {
            continue;
        }

        entries.push(build_manual_entry(&registration));
    }

    entries.sort_by(|left, right| {
        left.display_name
            .to_ascii_lowercase()
            .cmp(&right.display_name.to_ascii_lowercase())
            .then(left.id.cmp(&right.id))
    });

    GameLibrarySnapshot {
        entries,
        steam_library_paths: steam_snapshot.steam_library_paths,
        scanned_at: steam_snapshot.scanned_at,
    }
}

fn load_reconciled_library(database_path: &Path) -> Result<GameLibrarySnapshot, AppError> {
    let connection = open_database(database_path)?;
    ensure_manual_registration_table(&connection)?;
    let manual_registrations = load_manual_registrations(&connection)?;
    let steam_snapshot = scan_steam_snapshot();

    Ok(reconcile_library(steam_snapshot, manual_registrations))
}

#[tauri::command]
pub async fn get_game_library(app: tauri::AppHandle) -> Result<GameLibrarySnapshot, AppError> {
    let database_path = app_database_path(&app)?;
    tauri::async_runtime::spawn_blocking(move || load_reconciled_library(&database_path))
        .await
        .map_err(|error| AppError::SystemError(error.to_string()))?
}

#[tauri::command]
pub async fn refresh_game_library(app: tauri::AppHandle) -> Result<GameLibrarySnapshot, AppError> {
    let database_path = app_database_path(&app)?;
    tauri::async_runtime::spawn_blocking(move || load_reconciled_library(&database_path))
        .await
        .map_err(|error| AppError::SystemError(error.to_string()))?
}

#[tauri::command]
pub async fn register_manual_game(
    app: tauri::AppHandle,
    input: ManualGameRegistrationInput,
) -> Result<GameLibraryEntry, AppError> {
    let database_path = app_database_path(&app)?;
    tauri::async_runtime::spawn_blocking(move || {
        let connection = open_database(&database_path)?;
        ensure_manual_registration_table(&connection)?;
        let now = now_timestamp();
        let registration = insert_manual_registration(&connection, &input, &now)?;
        Ok(build_manual_entry(&registration))
    })
    .await
    .map_err(|error| AppError::SystemError(error.to_string()))?
}

#[tauri::command]
pub async fn remove_manual_game(
    app: tauri::AppHandle,
    game_id: String,
) -> Result<(), AppError> {
    let database_path = app_database_path(&app)?;
    tauri::async_runtime::spawn_blocking(move || {
        let connection = open_database(&database_path)?;
        ensure_manual_registration_table(&connection)?;
        delete_manual_registration(&connection, &game_id)
    })
    .await
    .map_err(|error| AppError::SystemError(error.to_string()))?
}

#[cfg(test)]
mod tests {
    use std::path::{Path, PathBuf};

    use super::{
        GameSource, ManualGameRegistrationInput, SteamScanEntry, build_steam_entry,
        delete_manual_registration, ensure_manual_registration_table, insert_manual_registration,
        load_manual_registrations, normalize_executable_path, normalize_install_root,
        parse_app_manifest, parse_libraryfolders_vdf, reconcile_library,
    };

    mod steam_contracts {
        use std::path::{Path, PathBuf};

        use super::{GameSource, build_steam_entry};

        #[test]
        fn steam_entries_keep_nullable_executable_paths_in_phase_3() {
            let entry = build_steam_entry(
                &super::SteamScanEntry {
                    app_id: 570,
                    display_name: "Dota 2".into(),
                    install_dir: PathBuf::from(r"D:\SteamLibrary\steamapps\common\dota 2 beta"),
                    normalized_install_root: super::normalize_install_root(Path::new(
                        r"D:\SteamLibrary\steamapps\common\dota 2 beta",
                    )),
                },
                "1712274000",
                None,
            );

            assert_eq!(entry.executable_path, None);
            assert_eq!(entry.source, GameSource::Steam);
            assert!(!entry.removable);
            assert!(!entry.user_added);
        }
    }

    mod steam_parsing {
        use super::{
            Path, PathBuf, SteamScanEntry, normalize_install_root, parse_app_manifest,
            parse_libraryfolders_vdf, reconcile_library,
        };

        #[test]
        fn parse_libraryfolders_collects_multiple_library_paths() {
            let contents = r#"
"libraryfolders"
{
    "0"
    {
        "path" "C:\\Program Files (x86)\\Steam"
    }
    "1" "D:\\SteamLibrary"
    "contentstatsid" "123456789"
}
"#;

            let paths = parse_libraryfolders_vdf(contents).expect("libraryfolders should parse");

            assert_eq!(paths.len(), 2);
            assert_eq!(
                paths,
                vec![
                    PathBuf::from(r"C:\Program Files (x86)\Steam"),
                    PathBuf::from(r"D:\SteamLibrary"),
                ]
            );
        }

        #[test]
        fn parse_app_manifest_extracts_app_id_name_and_install_dir() {
            let contents = r#"
"AppState"
{
    "appid" "730"
    "name" "Counter-Strike 2"
    "installdir" "Counter-Strike Global Offensive"
}
"#;

            let manifest = parse_app_manifest(contents).expect("manifest should parse");

            assert_eq!(manifest.appid.as_deref(), Some("730"));
            assert_eq!(manifest.name.as_deref(), Some("Counter-Strike 2"));
            assert_eq!(
                manifest.installdir.as_deref(),
                Some("Counter-Strike Global Offensive")
            );
        }

        #[test]
        fn steam_scan_skips_broken_manifests_without_failing() {
            let snapshot = super::super::SteamScanSnapshot {
                entries: vec![SteamScanEntry {
                    app_id: 730,
                    display_name: "Counter-Strike 2".into(),
                    install_dir: PathBuf::from(
                        r"D:\SteamLibrary\steamapps\common\Counter-Strike Global Offensive",
                    ),
                    normalized_install_root: normalize_install_root(Path::new(
                        r"D:\SteamLibrary\steamapps\common\Counter-Strike Global Offensive",
                    )),
                }],
                steam_library_paths: vec![r"D:\SteamLibrary".into()],
                scanned_at: "1712274000".into(),
            };

            let reconciled = reconcile_library(snapshot, Vec::new());

            assert_eq!(reconciled.entries.len(), 1);
            assert_eq!(reconciled.entries[0].steam_app_id, Some(730));
            assert_eq!(reconciled.entries[0].executable_path, None);
        }
    }

    mod manual_registry {
        use std::path::{Path, PathBuf};

        use rusqlite::Connection;

        use super::{
            GameSource, ManualGameRegistrationInput, SteamScanEntry, delete_manual_registration,
            ensure_manual_registration_table, insert_manual_registration, load_manual_registrations,
            normalize_executable_path, normalize_install_root, reconcile_library,
        };

        fn memory_connection() -> Connection {
            let connection = Connection::open_in_memory().expect("in-memory db should open");
            ensure_manual_registration_table(&connection).expect("manual table should exist");
            connection
        }

        #[test]
        fn register_manual_game_persists_unique_manual_registration() {
            let connection = memory_connection();
            let input = ManualGameRegistrationInput {
                display_name: "Celeste".into(),
                executable_path: r"D:\Games\Celeste\Celeste.exe".into(),
            };

            let registration =
                insert_manual_registration(&connection, &input, "1712274000").expect("manual insert");
            let loaded = load_manual_registrations(&connection).expect("manual rows should load");

            assert_eq!(loaded.len(), 1);
            assert_eq!(registration.display_name, "Celeste");
            assert_eq!(
                loaded[0].normalized_executable_path,
                normalize_executable_path(Path::new(r"D:\Games\Celeste\Celeste.exe"))
            );
        }

        #[test]
        fn remove_manual_game_deletes_manual_registration() {
            let connection = memory_connection();
            let input = ManualGameRegistrationInput {
                display_name: "Celeste".into(),
                executable_path: r"D:\Games\Celeste\Celeste.exe".into(),
            };

            let registration =
                insert_manual_registration(&connection, &input, "1712274000").expect("manual insert");
            delete_manual_registration(&connection, &format!("manual:{}", registration.id))
                .expect("manual delete should succeed");

            let loaded = load_manual_registrations(&connection).expect("manual rows should load");
            assert!(loaded.is_empty());
        }

        #[test]
        fn reconciliation_matches_manual_and_steam_by_normalized_install_root() {
            let connection = memory_connection();
            let input = ManualGameRegistrationInput {
                display_name: "Counter-Strike 2".into(),
                executable_path: r"D:\SteamLibrary\steamapps\common\Counter-Strike Global Offensive\game\bin\win64\cs2.exe".into(),
            };

            insert_manual_registration(&connection, &input, "1712274000").expect("manual insert");
            let manuals = load_manual_registrations(&connection).expect("manual rows should load");
            let snapshot = super::super::SteamScanSnapshot {
                entries: vec![SteamScanEntry {
                    app_id: 730,
                    display_name: "Counter-Strike 2".into(),
                    install_dir: PathBuf::from(
                        r"D:\SteamLibrary\steamapps\common\Counter-Strike Global Offensive",
                    ),
                    normalized_install_root: normalize_install_root(Path::new(
                        r"D:\SteamLibrary\steamapps\common\Counter-Strike Global Offensive",
                    )),
                }],
                steam_library_paths: vec![r"D:\SteamLibrary".into()],
                scanned_at: "1712274000".into(),
            };

            let reconciled = reconcile_library(snapshot, manuals);

            assert_eq!(reconciled.entries.len(), 1);
            assert_eq!(reconciled.entries[0].source, GameSource::Steam);
            assert_eq!(reconciled.entries[0].steam_app_id, Some(730));
            assert!(reconciled.entries[0].executable_path.is_some());
        }

        #[test]
        fn reconciliation_preserves_user_added_provenance_when_promoted_to_steam() {
            let connection = memory_connection();
            let input = ManualGameRegistrationInput {
                display_name: "Counter-Strike 2".into(),
                executable_path: r"D:\SteamLibrary\steamapps\common\Counter-Strike Global Offensive\game\bin\win64\cs2.exe".into(),
            };

            insert_manual_registration(&connection, &input, "1712274000").expect("manual insert");
            let manuals = load_manual_registrations(&connection).expect("manual rows should load");
            let snapshot = super::super::SteamScanSnapshot {
                entries: vec![SteamScanEntry {
                    app_id: 730,
                    display_name: "Counter-Strike 2".into(),
                    install_dir: PathBuf::from(
                        r"D:\SteamLibrary\steamapps\common\Counter-Strike Global Offensive",
                    ),
                    normalized_install_root: normalize_install_root(Path::new(
                        r"D:\SteamLibrary\steamapps\common\Counter-Strike Global Offensive",
                    )),
                }],
                steam_library_paths: vec![r"D:\SteamLibrary".into()],
                scanned_at: "1712274000".into(),
            };

            let reconciled = reconcile_library(snapshot, manuals);

            assert_eq!(reconciled.entries[0].source, GameSource::Steam);
            assert!(reconciled.entries[0].user_added);
            assert!(!reconciled.entries[0].removable);
        }

        #[test]
        fn manual_registration_reappears_when_steam_detection_disappears() {
            let connection = memory_connection();
            let input = ManualGameRegistrationInput {
                display_name: "Counter-Strike 2".into(),
                executable_path: r"D:\SteamLibrary\steamapps\common\Counter-Strike Global Offensive\game\bin\win64\cs2.exe".into(),
            };

            insert_manual_registration(&connection, &input, "1712274000").expect("manual insert");
            let manuals = load_manual_registrations(&connection).expect("manual rows should load");
            let snapshot = super::super::SteamScanSnapshot {
                entries: Vec::new(),
                steam_library_paths: vec![r"D:\SteamLibrary".into()],
                scanned_at: "1712274000".into(),
            };

            let reconciled = reconcile_library(snapshot, manuals);

            assert_eq!(reconciled.entries.len(), 1);
            assert_eq!(reconciled.entries[0].source, GameSource::Manual);
            assert!(reconciled.entries[0].user_added);
            assert!(reconciled.entries[0].removable);
        }
    }
}
