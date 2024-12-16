use migration::entities::{project,area,note};
use serde::{Deserialize, Serialize};


#[derive(Debug,Clone,Serialize,Deserialize)]
pub struct Note {
    pub title: Option<String>,
    pub discription: Option<String>,
    pub content:Option<String>,
    pub media:Option<Vec<String>>,
    pub area_id: Option<i32>,
    pub project_id:Option<i32>,
    pub sturcture:String
}

#[derive(Debug,Clone,Serialize,Deserialize)]
pub struct Payload {
   pub command:String,
   pub item:Option<Note>,
   pub id:Option<i32>
}
