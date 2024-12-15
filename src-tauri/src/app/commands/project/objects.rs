use migration::entities::{project,area,note};
use serde::{Deserialize, Serialize};


#[derive(Debug,Clone,Serialize,Deserialize)]
pub struct Project {
    pub title: Option<String>,
    pub discription: Option<String>,
    pub cover: Option<String>,
    pub icon: Option<String>,
    pub area_id: Option<i32>,
}

pub struct ProjectPage{
    pub info:project::Model,
    pub projects:Vec<project::Model>,
    pub notes:Vec<note::Model>
}

#[derive(Debug,Clone,Serialize,Deserialize)]
pub struct Payload {
   pub command:String,
   pub item:Option<Project>,
   pub id:Option<i32>
}
