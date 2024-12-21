use migration::entities::{area, note, project};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Media {
    pub buffer: String,
    pub note_id: Option<i32>,
    pub project_id: Option<i32>,
    pub structure: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Payload {
    pub command: String,
    pub item: Option<Media>,
    pub id: Option<i32>,
}
