use migration::entities::{area, note, project};
use sea_query::driver;
use serde::{Deserialize, Serialize};


#[derive(Debug,Clone,Serialize,Deserialize)]
pub struct Resource {
    pub title: Option<String>,
    pub discription: Option<String>,
    pub cover: Option<String>,
    pub icon: Option<String>,
}

#[derive(Deserialize,Serialize,Debug,Clone)]
pub struct ResourcePage {
    pub info: area::Model,
    pub projects: Vec<project::Model>,
    pub notes: Vec<note::Model>,
}

#[derive(Clone,Serialize,Deserialize)]
pub struct Payload {
    pub command: String,
    pub item: Option<Resource>,
    pub id:Option<Resource>,
}
