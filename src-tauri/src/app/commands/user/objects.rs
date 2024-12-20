use migration::entities::{note, project, todo, user};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct User {
    pub name: String,
    pub email: String,
    pub password: String,
    pub icon: Option<String>,
}

pub struct UserPage {
    pub info: user::Model,
    pub projects: Vec<project::Model>,
    pub notes: Vec<note::Model>,
    pub todo: Vec<todo::Model>,
}

#[derive(Serialize, Deserialize, Clone)]

pub struct Payload {
    pub command: String,
    pub item: Option<User>,
    pub id: Option<i32>,
}
