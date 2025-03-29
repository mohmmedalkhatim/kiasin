use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Component {
    pub id: i32,
    pub name: String,
    pub content: String,
}
#[derive(Serialize, Deserialize)]
pub struct Payload {
    pub command: String,
    pub id: Option<i32>,
    pub item: Option<Component>,
}
