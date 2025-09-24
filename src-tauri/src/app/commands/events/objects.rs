use chrono::{DateTime, NaiveDate, Utc};
use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EventUpdateDTO {
    pub id: String,
    pub summary: Option<String>,
    pub description: Option<String>,
    pub start: Option<Value>, // JSON object: {"date": "..."} or {"dateTime": "..."}
    pub end: Option<Value>,
    pub location: Option<String>,
    pub color_id: Option<String>,
    pub creator: Option<Value>,
    pub organizer: Option<Value>,
    pub end_time_unspecified: Option<bool>,
    pub recurrence: Option<Value>,
    pub attendees: Option<Value>,
    pub reminders: Option<Value>,
    pub conference_data: Option<Value>,
    pub transparency: Option<String>,
    pub visibility: Option<String>,
    pub ical_uid: Option<String>,
    pub sequence: Option<i32>,
    pub attachments: Option<Value>,
    pub guests_can_invite_others: Option<bool>,
    pub guests_can_modify: Option<bool>,
    pub guests_can_see_other_guests: Option<bool>,
    pub hangout_link: Option<String>,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EventDTO {
    pub id: Option<String>,
    pub summary: Option<String>,
    pub description: Option<Value>,
    pub start: NaiveDate,
    pub end: NaiveDate,
    pub created: Option<DateTime<Utc>>,
    pub updated: Option<DateTime<Utc>>,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Payload {
    pub id: Option<i32>,
    pub command: String,
    pub item: Option<EventDTO>,
    pub update_item: Option<EventUpdateDTO>,
}
