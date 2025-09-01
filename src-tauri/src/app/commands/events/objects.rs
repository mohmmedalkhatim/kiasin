use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Event {
    pub id: Option<i32>,
    pub start: NaiveDate,
    pub title: Option<String>,
    pub end: NaiveDate,
    pub description: Option<Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Payload {
    pub id: Option<i32>,
    pub command: String,
    pub item: Option<Event>,
}
