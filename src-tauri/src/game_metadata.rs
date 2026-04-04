use std::fs;
use std::path::{Path, PathBuf};
use std::time::{SystemTime, UNIX_EPOCH};

use base64::engine::general_purpose::STANDARD as BASE64_STANDARD;
use base64::Engine;
use reqwest::blocking::Client;
use reqwest::header::{AUTHORIZATION, CONTENT_TYPE};
use serde::{Deserialize, Serialize};

use crate::errors::AppError;

const CACHE_DIR_NAME: &str = "metadata-cache";
const CACHE_STALE_AFTER_SECS: u64 = 60 * 60 * 24;

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum MetadataCacheStatus {
    Missing,
    Fallback,
    Cached,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GameMetadataSummary {
    pub library_portrait_asset_url: Option<String>,
    pub detail_hero_asset_url: Option<String>,
    pub short_description: Option<String>,
    pub platforms: Vec<String>,
    pub cache_status: MetadataCacheStatus,
    pub last_updated_at: Option<String>,
    pub shared_steam_app_id: Option<u32>,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CachedSteamMetadata {
    pub steam_app_id: u32,
    pub locale: String,
    pub title: String,
    pub short_description: Option<String>,
    #[serde(default, alias = "coverArtAssetUrl")]
    pub library_portrait_asset_url: Option<String>,
    #[serde(default)]
    pub detail_hero_asset_url: Option<String>,
    pub platforms: Vec<String>,
    pub fetched_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
struct AppDetailsEnvelope {
    success: bool,
    data: Option<AppDetailsData>,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
struct AppDetailsData {
    name: Option<String>,
    short_description: Option<String>,
    header_image: Option<String>,
    platforms: Option<AppDetailsPlatforms>,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
struct AppDetailsPlatforms {
    windows: Option<bool>,
    mac: Option<bool>,
    linux: Option<bool>,
}

fn now_timestamp() -> String {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|value| value.as_secs().to_string())
        .unwrap_or_else(|_| "0".into())
}

pub fn metadata_cache_dir(app_data_dir: &Path) -> Result<PathBuf, AppError> {
    let cache_dir = app_data_dir.join(CACHE_DIR_NAME);
    fs::create_dir_all(&cache_dir).map_err(|error| AppError::SystemError(error.to_string()))?;
    Ok(cache_dir)
}

fn normalize_cache_locale(locale: &str) -> String {
    locale.replace('-', "_").to_ascii_lowercase()
}

fn steam_store_language(locale: &str) -> &'static str {
    match locale {
        "pt-BR" => "brazilian",
        _ => "english",
    }
}

fn metadata_cache_file(cache_dir: &Path, steam_app_id: u32, locale: &str) -> PathBuf {
    cache_dir.join(format!(
        "{steam_app_id}-{}.json",
        normalize_cache_locale(locale)
    ))
}

pub fn load_cached_metadata(
    cache_dir: &Path,
    steam_app_id: u32,
    locale: &str,
) -> Option<CachedSteamMetadata> {
    let cache_file = metadata_cache_file(cache_dir, steam_app_id, locale);
    let contents = fs::read_to_string(cache_file).ok()?;
    serde_json::from_str(&contents).ok()
}

fn write_cached_metadata(cache_dir: &Path, cached: &CachedSteamMetadata) -> Result<(), AppError> {
    let cache_file = metadata_cache_file(cache_dir, cached.steam_app_id, &cached.locale);
    let contents = serde_json::to_string_pretty(cached)
        .map_err(|error| AppError::SystemError(error.to_string()))?;
    fs::write(cache_file, contents).map_err(|error| AppError::SystemError(error.to_string()))
}

fn is_stale(cached: &CachedSteamMetadata) -> bool {
    let fetched_at = cached.fetched_at.parse::<u64>().unwrap_or_default();
    let now = now_timestamp().parse::<u64>().unwrap_or_default();

    now.saturating_sub(fetched_at) >= CACHE_STALE_AFTER_SECS
}

fn fallback_platforms(fallback: &[String]) -> Vec<String> {
    if fallback.is_empty() {
        vec!["Windows".into()]
    } else {
        fallback.to_vec()
    }
}

fn build_summary_from_cache(
    cached: &CachedSteamMetadata,
    steam_app_id: u32,
    fallback: &[String],
) -> GameMetadataSummary {
    GameMetadataSummary {
        library_portrait_asset_url: cached.library_portrait_asset_url.clone(),
        detail_hero_asset_url: cached
            .detail_hero_asset_url
            .clone()
            .or_else(|| cached.library_portrait_asset_url.clone()),
        short_description: cached.short_description.clone(),
        platforms: if cached.platforms.is_empty() {
            fallback_platforms(fallback)
        } else {
            cached.platforms.clone()
        },
        cache_status: MetadataCacheStatus::Cached,
        last_updated_at: Some(cached.fetched_at.clone()),
        shared_steam_app_id: Some(steam_app_id),
    }
}

pub fn build_fallback_metadata_summary(
    steam_app_id: Option<u32>,
    fallback: &[String],
) -> GameMetadataSummary {
    GameMetadataSummary {
        library_portrait_asset_url: None,
        detail_hero_asset_url: None,
        short_description: None,
        platforms: fallback_platforms(fallback),
        cache_status: if steam_app_id.is_some() {
            MetadataCacheStatus::Fallback
        } else {
            MetadataCacheStatus::Missing
        },
        last_updated_at: None,
        shared_steam_app_id: steam_app_id,
    }
}

pub fn resolve_metadata_summary(
    cache_dir: &Path,
    steam_app_id: Option<u32>,
    fallback: &[String],
    locale: &str,
) -> (GameMetadataSummary, Option<u32>) {
    let Some(steam_app_id) = steam_app_id else {
        return (build_fallback_metadata_summary(None, fallback), None);
    };

    let cached = load_cached_metadata(cache_dir, steam_app_id, locale);
    let pending_refresh = match &cached {
        Some(cached) if is_stale(cached) => Some(steam_app_id),
        Some(_) => None,
        None => Some(steam_app_id),
    };

    let summary = cached
        .as_ref()
        .map(|cached| build_summary_from_cache(cached, steam_app_id, fallback))
        .unwrap_or_else(|| build_fallback_metadata_summary(Some(steam_app_id), fallback));

    (summary, pending_refresh)
}

fn extract_platforms(platforms: Option<AppDetailsPlatforms>) -> Vec<String> {
    let mut values = Vec::new();

    if let Some(platforms) = platforms {
        if platforms.windows.unwrap_or(false) {
            values.push("Windows".into());
        }
        if platforms.mac.unwrap_or(false) {
            values.push("macOS".into());
        }
        if platforms.linux.unwrap_or(false) {
            values.push("Linux".into());
        }
    }

    if values.is_empty() {
        values.push("Windows".into());
    }

    values
}

fn fetch_image_as_data_url(client: &Client, image_url: &str) -> Result<Option<String>, AppError> {
    let response = client
        .get(image_url)
        .send()
        .map_err(|error| AppError::OperationFailed(error.to_string()))?
        .error_for_status()
        .map_err(|error| AppError::OperationFailed(error.to_string()))?;

    let content_type = response
        .headers()
        .get(CONTENT_TYPE)
        .and_then(|value| value.to_str().ok())
        .unwrap_or("image/jpeg")
        .to_string();

    let bytes = response
        .bytes()
        .map_err(|error| AppError::OperationFailed(error.to_string()))?;
    let encoded = BASE64_STANDARD.encode(bytes);

    Ok(Some(format!("data:{content_type};base64,{encoded}")))
}

fn fetch_cover_art_asset_url(
    client: &Client,
    steam_app_id: u32,
) -> Result<Option<String>, AppError> {
    let candidates = vec![
        format!(
            "https://cdn.cloudflare.steamstatic.com/steam/apps/{steam_app_id}/library_600x900_2x.jpg"
        ),
        format!(
            "https://cdn.cloudflare.steamstatic.com/steam/apps/{steam_app_id}/library_600x900.jpg"
        ),
    ];

    for candidate in candidates {
        if let Ok(result) = fetch_image_as_data_url(client, &candidate) {
            return Ok(result);
        }
    }

    Ok(None)
}

fn fetch_detail_hero_asset_url(
    client: &Client,
    header_image_url: Option<&str>,
) -> Result<Option<String>, AppError> {
    let Some(header_image_url) = header_image_url else {
        return Ok(None);
    };

    fetch_image_as_data_url(client, header_image_url)
}

fn steamgriddb_api_key() -> Option<String> {
    std::env::var("STEAMGRIDDB_API_KEY")
        .ok()
        .or_else(|| std::env::var("SGDB_API_KEY").ok())
        .map(|value| value.trim().to_string())
        .filter(|value| !value.is_empty())
}

fn fetch_steamgriddb_portrait_asset_url(
    client: &Client,
    steam_app_id: u32,
) -> Result<Option<String>, AppError> {
    let Some(api_key) = steamgriddb_api_key() else {
        return Ok(None);
    };

    let response = client
        .get(format!(
            "https://www.steamgriddb.com/api/v2/grids/steam/{steam_app_id}"
        ))
        .header(AUTHORIZATION, format!("Bearer {api_key}"))
        .send()
        .map_err(|error| AppError::OperationFailed(error.to_string()))?
        .error_for_status()
        .map_err(|error| AppError::OperationFailed(error.to_string()))?
        .json::<serde_json::Value>()
        .map_err(|error| AppError::OperationFailed(error.to_string()))?;

    let best_url = response
        .get("data")
        .and_then(|value| value.as_array())
        .into_iter()
        .flatten()
        .filter_map(|entry| {
            let width = entry.get("width").and_then(|value| value.as_u64())?;
            let height = entry.get("height").and_then(|value| value.as_u64())?;

            if width >= height {
                return None;
            }

            let aspect_score = ((width as f64 / height as f64) - (600_f64 / 900_f64)).abs();
            let url = entry
                .get("url")
                .or_else(|| entry.get("thumb"))
                .and_then(|value| value.as_str())?;

            Some((aspect_score, width * height, url.to_string()))
        })
        .min_by(|left, right| {
            left.0
                .partial_cmp(&right.0)
                .unwrap_or(std::cmp::Ordering::Equal)
                .then(right.1.cmp(&left.1))
        })
        .map(|(_, _, url)| url);

    let Some(best_url) = best_url else {
        return Ok(None);
    };

    fetch_image_as_data_url(client, &best_url)
}

pub fn refresh_metadata_cache_for_app_ids(
    cache_dir: &Path,
    app_ids: &[u32],
    locale: &str,
) -> Result<(), AppError> {
    if app_ids.is_empty() {
        return Ok(());
    }

    let client = Client::builder()
        .user_agent("OptiHub/0.1.0")
        .build()
        .map_err(|error| AppError::OperationFailed(error.to_string()))?;

    for app_id in app_ids {
        let app_details_url = format!(
            "https://store.steampowered.com/api/appdetails?appids={app_id}&l={}",
            steam_store_language(locale)
        );
        let payload = client
            .get(&app_details_url)
            .send()
            .map_err(|error| AppError::OperationFailed(error.to_string()))?
            .error_for_status()
            .map_err(|error| AppError::OperationFailed(error.to_string()))?
            .json::<serde_json::Value>()
            .map_err(|error| AppError::OperationFailed(error.to_string()))?;

        let envelope = payload
            .get(app_id.to_string())
            .cloned()
            .ok_or_else(|| {
                AppError::OperationFailed(format!(
                    "Missing app details envelope for Steam app {app_id}"
                ))
            })
            .and_then(|value| {
                serde_json::from_value::<AppDetailsEnvelope>(value)
                    .map_err(|error| AppError::OperationFailed(error.to_string()))
            })?;

        if !envelope.success {
            return Err(AppError::OperationFailed(format!(
                "Steam app details request was not successful for app {app_id}"
            )));
        }

        let data = envelope.data.ok_or_else(|| {
            AppError::OperationFailed(format!(
                "Steam app details response had no data for app {app_id}"
            ))
        })?;

        let cached = CachedSteamMetadata {
            steam_app_id: *app_id,
            locale: locale.to_string(),
            title: data.name.unwrap_or_else(|| format!("Steam App {app_id}")),
            short_description: data
                .short_description
                .map(|value| value.trim().to_string())
                .filter(|value| !value.is_empty()),
            library_portrait_asset_url: fetch_cover_art_asset_url(&client, *app_id)?.or_else(
                || {
                    fetch_steamgriddb_portrait_asset_url(&client, *app_id)
                        .ok()
                        .flatten()
                },
            ),
            detail_hero_asset_url: fetch_detail_hero_asset_url(
                &client,
                data.header_image.as_deref(),
            )?,
            platforms: extract_platforms(data.platforms),
            fetched_at: now_timestamp(),
        };

        write_cached_metadata(cache_dir, &cached)?;
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use std::fs;
    use std::path::PathBuf;

    use super::{
        build_fallback_metadata_summary, load_cached_metadata, resolve_metadata_summary,
        write_cached_metadata, CachedSteamMetadata, MetadataCacheStatus,
    };

    fn temp_cache_dir(test_name: &str) -> PathBuf {
        let dir = std::env::temp_dir().join(format!("optihub-metadata-{test_name}"));
        let _ = fs::remove_dir_all(&dir);
        fs::create_dir_all(&dir).expect("temp cache dir should exist");
        dir
    }

    #[test]
    fn fallback_summary_uses_missing_when_no_shared_app_id_exists() {
        let summary = build_fallback_metadata_summary(None, &["Windows".into()]);

        assert_eq!(summary.cache_status, MetadataCacheStatus::Missing);
        assert_eq!(summary.platforms, vec!["Windows"]);
        assert_eq!(summary.shared_steam_app_id, None);
    }

    #[test]
    fn resolve_metadata_summary_returns_cached_state_when_cache_file_exists() {
        let cache_dir = temp_cache_dir("resolve-cached");
        let cached = CachedSteamMetadata {
            steam_app_id: 730,
            locale: "en".into(),
            title: "Counter-Strike 2".into(),
            short_description: Some("Shooter".into()),
            library_portrait_asset_url: Some("data:image/jpeg;base64,abc".into()),
            detail_hero_asset_url: Some("data:image/jpeg;base64,xyz".into()),
            platforms: vec!["Windows".into()],
            fetched_at: super::now_timestamp(),
        };

        write_cached_metadata(&cache_dir, &cached).expect("cache should be written");
        let (summary, pending_refresh) =
            resolve_metadata_summary(&cache_dir, Some(730), &["Windows".into()], "en");

        assert_eq!(summary.cache_status, MetadataCacheStatus::Cached);
        assert_eq!(summary.short_description.as_deref(), Some("Shooter"));
        assert_eq!(
            summary.library_portrait_asset_url.as_deref(),
            Some("data:image/jpeg;base64,abc")
        );
        assert_eq!(
            summary.detail_hero_asset_url.as_deref(),
            Some("data:image/jpeg;base64,xyz")
        );
        assert_eq!(pending_refresh, None);
        assert!(load_cached_metadata(&cache_dir, 730, "en").is_some());
    }

    #[test]
    fn cached_metadata_is_stored_per_locale() {
        let cache_dir = temp_cache_dir("resolve-by-locale");
        let english = CachedSteamMetadata {
            steam_app_id: 730,
            locale: "en".into(),
            title: "Counter-Strike 2".into(),
            short_description: Some("English copy".into()),
            library_portrait_asset_url: Some("data:image/jpeg;base64,en".into()),
            detail_hero_asset_url: None,
            platforms: vec!["Windows".into()],
            fetched_at: super::now_timestamp(),
        };
        let brazilian = CachedSteamMetadata {
            steam_app_id: 730,
            locale: "pt-BR".into(),
            title: "Counter-Strike 2".into(),
            short_description: Some("Texto em português".into()),
            library_portrait_asset_url: Some("data:image/jpeg;base64,pt".into()),
            detail_hero_asset_url: None,
            platforms: vec!["Windows".into()],
            fetched_at: super::now_timestamp(),
        };

        write_cached_metadata(&cache_dir, &english).expect("english cache should be written");
        write_cached_metadata(&cache_dir, &brazilian).expect("brazilian cache should be written");

        let english_loaded = load_cached_metadata(&cache_dir, 730, "en").expect("english cache");
        let brazilian_loaded =
            load_cached_metadata(&cache_dir, 730, "pt-BR").expect("brazilian cache");

        assert_eq!(
            english_loaded.short_description.as_deref(),
            Some("English copy")
        );
        assert_eq!(
            brazilian_loaded.short_description.as_deref(),
            Some("Texto em português")
        );
    }
}
