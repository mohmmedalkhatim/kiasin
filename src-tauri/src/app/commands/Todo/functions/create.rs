use migration::entities::todo::{ActiveModel, Entity};
use sea_orm::{
    DatabaseConnection, EntityTrait, Set,
};

use crate::app::commands::todo::objects::Todo;

pub async fn create_note(note: Todo, db: &DatabaseConnection) -> Result<i32, String> {
    let time = chrono::Local::now();
    let new = ActiveModel {
        title: Set(note.title),
        area_id: Set(note.area_id),
        update: Set(time.date_naive()),
        user_assgin_id: Set(note.user_assgin_id),
        creator_id: Set(note.creator_id),
        checked: Set(false),
        created: Set(time.date_naive()),
        ..Default::default()
    };
    let note = Entity::insert(new).exec(db).await.expect("problem with the database").last_insert_id;
    Ok(note)
}
