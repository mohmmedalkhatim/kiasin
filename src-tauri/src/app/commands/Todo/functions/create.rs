use migration::entities::note::{ActiveModel, Entity};
use sea_orm::{DatabaseConnection, EntityTrait, Set};

use crate::app::commands::note::objects::Note;


pub async fn create_note(note: Note,db:&DatabaseConnection) -> Result<(), String> {

    let new = ActiveModel {
        title: Set(note.title),
        area_id: Set(note.area_id),
        project_id: Set(note.project_id),
        content: Set(note.content),
        description: Set(note.discription),
        ..Default::default()
    };
    let note  = Entity::insert(new).exec(db).await;
    
    Ok(())
}
