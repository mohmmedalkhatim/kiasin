use migration::entities::{
    note,
    todo::{ActiveModel, Entity},
};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait, Set};
use serde_json::json;

use crate::app::commands::todo::objects::Todo;

pub async fn create_todo(todo: Todo, db: &DatabaseConnection) -> Result<i32, DbErr> {
    let time = chrono::Local::now();
    let active = note::ActiveModel {
        title: Set(Some(todo.title.clone())),
        content: Set(Some(json!({"content":""}))),
        in_archive: Set(false),
        create_date: Set(Some(time.date_naive())),
        ..Default::default()
    };
    let note_id = note::Entity::insert(active).exec(db).await?.last_insert_id;
    let new = ActiveModel {
        title: Set(todo.title.clone()),
        area_id: Set(todo.area_id),
        note_id: Set(note_id),
        checked: Set(false),
        created: Set(time.date_naive()),
        ..Default::default()
    };
    let id = Entity::insert(new).exec(db).await?.last_insert_id;
    Ok(id)
}
