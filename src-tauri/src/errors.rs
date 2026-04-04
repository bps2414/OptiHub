use serde::Serialize;
use thiserror::Error;

#[allow(dead_code)]
#[derive(Debug, Error, Serialize)]
#[serde(tag = "kind", content = "message")]
pub enum AppError {
    #[error("Not found: {0}")]
    NotFound(String),

    #[error("Operation failed: {0}")]
    OperationFailed(String),

    #[error("Invalid input: {0}")]
    InvalidInput(String),

    #[error("System error: {0}")]
    SystemError(String),
}
