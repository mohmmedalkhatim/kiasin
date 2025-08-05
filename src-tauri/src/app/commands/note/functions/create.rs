use chrono::Local;
use migration::entities::{
    media,
    note::{self, ActiveModel, Entity, Model},
};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait, Set};
use serde_json::json;

use crate::app::commands::note::objects::Note;

pub async fn create_note(note: Note, db: &DatabaseConnection) -> Result<(), String> {
    let new = ActiveModel {
        title: Set(note.title),
        area_id: Set(note.area_id),
        description: Set(note.description),
        content: Set(note.content),
        ..Default::default()
    };
    let id = Entity::insert(new).exec(db).await.unwrap().last_insert_id;
    match note.media {
        Some(v) => {
            for med in v {
                let file = base64::decode(med.buffer.clone()).unwrap();
                let obj = media::ActiveModel {
                    media_type: Set(med.structure),
                    file: Set(file),
                    note_id: Set(Some(id)),
                    project_id: Set(note.project_id),
                    ..Default::default()
                };
                let _ = media::Entity::insert(obj).exec(db).await;
            }
        }
        None => {}
    }
    Ok(())
}

pub async fn create_emty(db: &DatabaseConnection) -> Result<Model, DbErr> {
    let data = Local::now();
    let active = note::ActiveModel {
        title: Set(Some("untitled".to_string())),
        content: Set(Some(json!({"content":""}))),
        in_archive: Set(false),
        create_date: Set(Some(data.date_naive())),
        ..Default::default()
    };
    let id = note::Entity::insert(active.clone()).exec(db).await?;
    let result = note::Entity::find_by_id(id.last_insert_id).one(db).await?;
    Ok(result.unwrap())
}
