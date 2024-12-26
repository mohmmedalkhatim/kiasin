use migration::entities::{media, note::{self,ActiveModel, Entity}};
use sea_orm::{entity::*, DatabaseConnection, DbErr, EntityTrait, QueryFilter, Set};

use crate::app::commands::note::objects::*;

pub async fn updata_note(note_dto: Note,id:i32, db: &DatabaseConnection) -> Result<(), DbErr> {

    let new = ActiveModel {
        title: Set(note_dto.title),
        area_id: Set(note_dto.area_id),
        project_id: Set(note_dto.project_id),
        content: Set(note_dto.content),
        description: Set(note_dto.discription),
        ..Default::default()
    };
    let _ = Entity::update(new).filter(note::Column::Id.eq(id)).exec(db).await?;
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
                let _ = media::Entity::update(obj).filter(media::Column::NoteId.eq(Some(id))).exec(db).await;
            }
        }
        None => {}
    }

    Ok(())
}
