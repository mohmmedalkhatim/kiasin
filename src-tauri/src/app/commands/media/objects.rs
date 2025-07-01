use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Media {
    pub id: Option<i32>,
    pub file:String,
    pub media_type:String,
    pub url:Option<String>,
    pub note_id:Option<i32>,
    pub project_id:Option<i32>,
    pub area_id:Option<i32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Payload {
    pub command: String,
    pub item: Option<Media>,
    pub id: Option<i32>,
    pub ids:Option<Vec<i32>>
}
