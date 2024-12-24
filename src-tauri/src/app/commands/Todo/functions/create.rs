use chrono::Datelike;
use migration::entities::todo::{ActiveModel, Entity};
use sea_orm::{
    prelude::{Date, TimeDate},
    DatabaseConnection, EntityTrait, Set,
};
use std::time::SystemTime;

use crate::app::commands::todo::objects::Todo;

pub async fn create_note(note: Todo, db: &DatabaseConnection) -> Result<(), String> {
    let time = chrono::Local::now();
    println!("{}", time.date_naive());
    let new = ActiveModel {
        title: Set(note.title),
        area_id: Set(note.area_id),
        project_id: Set(note.project_id),
        update: Set(time.date_naive()),
        user_assgin_id: todo!(),
        creator_id: todo!(),
        id: todo!(),
        checked: todo!(),
        created: todo!(),
    };
    let note = Entity::insert(new).exec(db).await;

    Ok(())
}
