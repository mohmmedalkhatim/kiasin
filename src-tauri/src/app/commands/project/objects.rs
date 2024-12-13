use migration::entities::{project,area,note};

pub struct Project {
    pub title: Option<String>,
    pub discription: Option<String>,
    pub cover: Option<String>,
    pub icon: Option<String>,
    pub area_id: Option<i32>,
}

pub struct AreaPage{
    pub info:area::Model,
    pub projects:Vec<project::Model>,
    pub notes:Vec<note::Model>
}

pub struct Payload {
   pub command:String,
   pub item:Project,

}
