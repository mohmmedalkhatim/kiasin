use migration::entities::{area, note, project};

pub struct Area {
    pub title: Option<String>,
    pub discription: Option<String>,
    pub cover: Option<String>,
    pub icon: Option<String>,
}

pub struct AreaPage {
    pub info: area::Model,
    pub projects: Vec<project::Model>,
    pub notes: Vec<note::Model>,
}

pub struct Payload {
    pub command: String,
    pub item: Area,
}
