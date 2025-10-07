use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Todo {
    pub id: Option<i32>,
    pub title: String,
    pub checked: Option<bool>,
    pub area_id: Option<i32>,
    pub content: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Payload {
    pub command: String,
    pub item: Option<Todo>,
    pub id: Option<i32>,
    pub ids: Option<Vec<i32>>,
}
