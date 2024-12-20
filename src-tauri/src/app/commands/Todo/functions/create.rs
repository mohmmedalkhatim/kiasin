use migration::entities::todo::{ActiveModel, Entity};
use sea_orm::{DatabaseConnection, EntityTrait, Set};

use crate::app::commands::todo::objects::Todo;

pub async fn create_note(note: Todo, db: &DatabaseConnection) -> Result<(), String> {
    let new = ActiveModel {
        title: Set(note.title),
        area_id: Set(note.area_id),
        project_id: Set(note.project_id),
        ..Default::default()
    };
    let note = Entity::insert(new).exec(db).await;

    Ok(())
}
