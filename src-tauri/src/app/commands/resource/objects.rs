use migration::entities::{area, note, project};
use serde::{Deserialize, Serialize};
use serde_json::Value;


#[derive(Debug,Clone,Serialize,Deserialize)]
pub struct Resource {
    pub title: Option<String>,
    pub discription: Option<String>,
    pub cover: Option<String>,
    pub icon: Option<String>,
    pub ui_schema:Value
}

#[derive(Deserialize,Serialize,Debug,Clone)]
pub struct ResourcePage {
    pub info: area::Model,
    pub projects: Vec<project::Model>,
    pub notes: Vec<note::Model>,
}

#[derive(Clone,Serialize,Deserialize)]
pub struct Payload {
    pub id:Option<i32>,
    pub command: String,
    pub item: Option<Resource>,
}
