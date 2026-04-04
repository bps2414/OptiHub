use serde::Serialize;

use crate::errors::AppError;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SystemInfo {
    pub app_name: String,
    pub app_version: String,
    pub platform: String,
}

fn localized_greeting(name: &str, locale: Option<&str>) -> String {
    let normalized = locale.unwrap_or_default().replace('_', "-").to_lowercase();

    if normalized.starts_with("pt") {
        return format!("Olá do OptiHub, {name}! O backend Rust está funcionando.");
    }

    format!("Hello from OptiHub, {name}! The Rust backend is working.")
}

#[tauri::command]
pub async fn greet(name: String, locale: Option<String>) -> Result<String, AppError> {
    let name = name.trim();

    if name.is_empty() {
        return Err(AppError::InvalidInput("Name cannot be empty".into()));
    }

    Ok(localized_greeting(name, locale.as_deref()))
}

#[tauri::command]
pub async fn get_system_info() -> Result<SystemInfo, AppError> {
    Ok(SystemInfo {
        app_name: "OptiHub".into(),
        app_version: env!("CARGO_PKG_VERSION").into(),
        platform: std::env::consts::OS.into(),
    })
}

#[cfg(test)]
mod tests {
    use super::localized_greeting;

    #[test]
    fn greet_defaults_to_english_copy() {
        let greeting = localized_greeting("Commander", None);

        assert_eq!(
            greeting,
            "Hello from OptiHub, Commander! The Rust backend is working."
        );
    }

    #[test]
    fn greet_supports_brazilian_portuguese_copy() {
        let greeting = localized_greeting("Comandante", Some("pt-BR"));

        assert_eq!(
            greeting,
            "Olá do OptiHub, Comandante! O backend Rust está funcionando."
        );
    }
}
