use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Note {
    pub id: i32,
    pub title: Option<String>,
    pub content: Option<Value>,
    pub description: Option<String>,
    pub media: Option<Vec<Media>>,
    pub area_id: Option<i32>,
    pub project_id: Option<i32>,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Media {
    pub buffer: String,
    pub note_id: Option<i32>,
    pub project_id: Option<i32>,
    pub structure: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Payload {
    pub command: String,
    pub item: Option<Note>,
    pub ids: Option<Vec<i32>>,
    pub id: Option<i32>,
}
