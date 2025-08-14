use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Payload {
    pub command: String,
    pub item: Database,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Database {
    pub id: u32,
    pub name: String,
    pub data: Value,
}
