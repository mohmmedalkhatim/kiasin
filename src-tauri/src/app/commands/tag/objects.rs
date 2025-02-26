use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Tag{
    pub name: String,
    pub ids: String,
}

pub struct Payload{
    pub command: String,
    pub item: Option<Tag>,
    pub id: Option<String>,
}