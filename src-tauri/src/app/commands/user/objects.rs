use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct User {
    pub name: String,
    pub email: String,
    pub password: String,
    pub icon: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]

pub struct Payload {
    pub command: String,
    pub item: Option<User>,
    pub id: Option<i32>,
}
