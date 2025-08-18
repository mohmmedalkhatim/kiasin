use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Payload {
    pub command: String,
    pub item: Option<Database>,
    pub id: Option<i32>,
    pub ids: Option<Vec<i32>>,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Database {
    pub id: i32,
    pub name: String,
    pub data: Value,
}
