use crate::app::commands::events::objects::EventUpdateDTO;

use chrono::Utc;
use migration::entities::event::{ActiveModel, Entity};
use sea_orm::{ActiveValue::Set, DatabaseConnection, DbErr, EntityTrait};
use serde_json::json;


pub async fn update(
    data: EventUpdateDTO,
    db: &DatabaseConnection,
) -> Result<(), DbErr> {
    let now = Utc::now();

    // Build the ActiveModel for update
    let model = ActiveModel {
        id: Set(data.id),
        summary: Set(data.summary),
        description: Set(data.description),
        start: Set(data.start.unwrap_or(json!({}))),
        end: Set(data.end.unwrap_or(json!({}))),
        location: Set(data.location),
        color_id: Set(data.color_id),
        creator: Set(data.creator),
        organizer: Set(data.organizer),
        end_time_unspecified: Set(data.end_time_unspecified),
        recurrence: Set(data.recurrence),
        attendees: Set(data.attendees),
        reminders: Set(data.reminders),
        conference_data: Set(data.conference_data),
        transparency: Set(data.transparency),
        visibility: Set(data.visibility),
        ical_uid: Set(data.ical_uid),
        sequence: Set(data.sequence),
        attachments: Set(data.attachments),
        guests_can_invite_others: Set(data.guests_can_invite_others),
        guests_can_modify: Set(data.guests_can_modify),
        guests_can_see_other_guests: Set(data.guests_can_see_other_guests),
        hangout_link: Set(data.hangout_link),
        updated: Set(Some(now)),
        ..Default::default()
    };

    // Execute the update
    Entity::update(model).exec(db).await?;

    Ok(())
}