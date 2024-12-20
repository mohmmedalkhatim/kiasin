use migration::entities::{area, note, project, todo};
use sea_query::driver;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Area {
    pub title: Option<String>,
    pub discription: Option<String>,
    pub cover: Option<String>,
    pub icon: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AreaPage {
    pub info: area::Model,
    pub projects: Vec<project::Model>,
    pub notes: Vec<note::Model>,
    pub todos: Vec<todo::Model>,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Payload {
    pub command: String,
    pub item: Option<Area>,
    pub id: Option<i32>,
}
