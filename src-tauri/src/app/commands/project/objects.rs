use migration::entities::{note, project, todo};
use serde::{Deserialize, Serialize};
use serde_json::Value;


#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Project {
    pub title: Option<String>,
    pub discription: Option<String>,
    pub cover: Option<String>,
    pub icon: Option<String>,
    pub area_id: Option<i32>,
    pub ui_schema:Value,
}

#[derive(Debug,Clone,Serialize,Deserialize)]
pub struct ProjectPage {
    pub info: project::Model,
    pub todos: Vec<todo::Model>,
    pub notes: Vec<note::Model>,
}
impl ProjectPage {
    pub fn new(info:project::Model,todos:Vec<todo::Model>,notes:Vec<note::Model>) -> ProjectPage {
        ProjectPage{
            info,
            todos,
            notes
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Payload {
    pub command: String,
    pub item: Option<Project>,
    pub id: Option<i32>,
}
