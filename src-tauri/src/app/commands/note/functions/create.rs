use migration::entities::{
    media,
    note::{ActiveModel, Entity},
};
use sea_orm::{DatabaseConnection, EntityTrait, Set};

use crate::app::commands::note::objects::Note;

pub async fn create_note(note: Note, db: &DatabaseConnection) -> Result<(), String> {
    let new = ActiveModel {
        title: Set(note.title),
        area_id: Set(note.area_id),
        content: Set(note.content),
        description: Set(note.discription),
        ..Default::default()
    };
    let id = Entity::insert(new).exec(db).await.unwrap().last_insert_id;
    match note.media {
        Some(v) => {
            for med in v {
                let file = base64::decode(med.buffer.clone()).unwrap();
                let obj = media::ActiveModel {
                    media_type: Set(med.structure),
                    buffer: Set(file),
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
