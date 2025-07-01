use chrono::Local;
use migration::entities::{
    area::{ActiveModel, Entity, Model},
    note,
};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait, Set};
use serde_json::json;

pub async fn create_area(db: &DatabaseConnection, id: i32) -> Result<Model, DbErr> {
    let shema = json!({
        "item":[]
    });
    let date = Local::now();
    let active_note = note::ActiveModel {
        title: Set(Some("untitled".to_string())),
        content: Set(Some(json!({"content":""}))),
        in_archive: Set(false),
        create_date: Set(Some(date.clone().date_naive())),
        ..Default::default()
    };
    let note = note::Entity::insert(active_note).exec(db).await?;

    let links = json!({ "list": [] });
    let new = ActiveModel {
        title: Set(Some("untitled".to_string())),
        user_id: Set(1),
        descrption: Set(Some("set a discrption".to_string())),
        icon: Set(None),
        cover: Set(None),
        links: Set(links),
        created: Set(Some(date.date_naive())),
        ui_schema: Set(shema),
        note_id: Set(note.last_insert_id),
        in_archive: Set(false),
        categorie: Set(id as u32),
        ..Default::default()
    };
    let id = Entity::insert(new).exec(db).await?.last_insert_id;
    let res = Entity::find_by_id(id).one(db).await?.unwrap();
    Ok(res)
}
