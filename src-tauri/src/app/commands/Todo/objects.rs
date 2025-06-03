use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Todo {
    pub id: Option<i32>,
    pub title: String,
    pub checked: bool,
    pub area_id: Option<i32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Payload {
    pub command: String,
    pub item: Option<Todo>,
    pub id: Option<i32>,
    pub ids: Option<Vec<i32>>,
}
