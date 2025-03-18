use migration::entities::{area, note, todo};
use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Debug, Clone, Serialize, Default, Deserialize)]
pub struct Area {
    pub title: Option<String>,
    pub discription: Option<String>,
    pub ui_schema: Value,
    pub cover: Option<String>,
    pub links: Value,
    pub icon: Option<String>,
    pub categorie:i32
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AreaPage {
    pub info: area::Model,
    pub notes: Vec<note::Model>,
    pub todos: Vec<todo::Model>,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Payload {
    pub command: String,
    pub item: Option<Area>,
    pub id: Option<i32>,
}
