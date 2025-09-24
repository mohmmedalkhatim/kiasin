use crate::entities::*;

#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "calendar_events")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: String, // Event ID from Google Calendar

    pub kind: Option<String>,
    pub etag: Option<String>,
    pub status: Option<String>,
    pub html_link: Option<String>,
    pub created: Option<DateTimeUtc>,
    pub updated: Option<DateTimeUtc>,
    pub summary: Option<String>,
    pub description: Option<String>,
    pub location: Option<String>,
    pub color_id: Option<String>,

    // For simplicity, store creator/organizer as JSON
    pub creator: Option<Json>,
    pub organizer: Option<Json>,

    pub start: Json, // Store start object as JSON
    pub end: Json,   // Store end object as JSON

    pub end_time_unspecified: Option<bool>,
    pub recurrence: Option<Json>,    // Array of strings as JSON
    pub attendees: Option<Json>,     // Array of objects as JSON
    pub reminders: Option<Json>,     // Object as JSON
    pub conference_data: Option<Json>, // Object as JSON

    pub transparency: Option<String>,
    pub visibility: Option<String>,
    pub ical_uid: Option<String>,
    pub sequence: Option<i32>,

    pub attachments: Option<Json>, // Array of attachments as JSON
    pub guests_can_invite_others: Option<bool>,
    pub guests_can_modify: Option<bool>,
    pub guests_can_see_other_guests: Option<bool>,

    pub hangout_link: Option<String>,
}

impl ActiveModelBehavior for ActiveModel {}

#[derive(Debug, EnumIter, PartialEq, DeriveRelation)]
pub enum Relation {}
