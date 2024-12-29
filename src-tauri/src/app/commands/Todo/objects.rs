use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Todo {
    pub title: String,
    pub checked: bool,
    pub update: String,
    pub user_assgin_id: Option<i32>,
    pub creator_id: i32,
    pub project_id: Option<i32>,
    pub area_id: Option<i32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Payload {
    pub command: String,
    pub item: Option<Todo>,
    pub id: Option<i32>,
}
