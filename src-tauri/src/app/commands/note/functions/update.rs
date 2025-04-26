use migration::entities::{
    media,
    note::{ActiveModel, Entity},
};
use sea_orm::{entity::*, DatabaseConnection, DbErr, EntityTrait, QueryFilter, Set};

use crate::app::commands::note::objects::*;

pub async fn update_note(note_dto: Note, id: i32, db: &DatabaseConnection) -> Result<(), DbErr> {
    let new = ActiveModel {
        id:Set(note_dto.id),
        title: Set(note_dto.title),
        description:Set(note_dto.description),
        content: Set(note_dto.content),
        ..Default::default()
    };
    let _ = Entity::update(new)
        .exec(db)
        .await?;
    match note_dto.media {
        Some(v) => {
            for med in v {
                let file = base64::decode(med.buffer.clone()).unwrap();
                let obj = media::ActiveModel {
                    media_type: Set(med.structure),
                    buffer: Set(file),
                    note_id: Set(Some(id)),
                    project_id: Set(note_dto.project_id),
                    ..Default::default()
                };
                let _ = media::Entity::update(obj)
                    .filter(media::Column::NoteId.eq(Some(id)))
                    .exec(db)
                    .await;
            }
        }
        None => {}
    }

    Ok(())
}
