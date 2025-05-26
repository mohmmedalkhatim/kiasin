use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Debug, Clone, Serialize, Default, Deserialize)]
pub struct Template {
    pub title: Option<String>,
    pub description: Option<String>,
    pub ui_schema: Value,
    pub cover: Option<String>,
    pub links: Value,
    pub icon: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Payload {
    pub command: String,
    pub item: Option<Template>,
    pub id: Option<i32>,
}
