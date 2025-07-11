
use chrono::Local;
use migration::entities::{
    area::{ActiveModel, Entity},
    note, template,
};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait, IntoActiveModel, Set};
use serde_json::json;


pub async fn create_area(db: &DatabaseConnection, id: i32) -> Result<i32, DbErr> {
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
    let note_id = note.last_insert_id;
    let links = json!({ "list": [] });
    let new = ActiveModel {
        title: Set(Some("untitled".to_string())),
        user_id: Set(1),
        descrption: Set(Some("set a description".to_string())),
        icon: Set(None),
        cover: Set(None),
        links: Set(links),
        created: Set(Some(date.date_naive())),
        ui_schema: Set(shema),
        note_id:Set(note_id.clone()),
        in_archive: Set(false),
        categorie: Set(id as u32),
        ..Default::default()
    };
    let id = Entity::insert(new).exec(db).await?.last_insert_id as i32;
   let _ = update_note_area_id(note_id, id, db);
    Ok(id)
}


pub async fn update_note_area_id(note_id:i32 , id: i32, db: &DatabaseConnection) -> Result<(), DbErr> {
    let new = note::ActiveModel {
        id: Set(note_id),
        area_id:Set(Some(id)),
        ..Default::default()
    };
    let _ = note::Entity::update(new).exec(db).await?;
    Ok(())
}


pub async fn create_from_templates(db: &DatabaseConnection, id: i32) -> Result<i32, DbErr> {
    let links = json!({ "list": [] });
    let date = Local::now();
    let model = template::Entity::find_by_id(id as u32).one(db).await;
    let active_note = note::ActiveModel {
        title: Set(Some("untitled".to_string())),
        content: Set(Some(json!({"content":""}))),
        in_archive: Set(false),
        create_date: Set(Some(date.date_naive())),
        ..Default::default()
    };
    let note = note::Entity::insert(active_note).exec(db).await?;

    let schema = model.unwrap().unwrap().into_active_model().ui_schema;
    let new = ActiveModel {
        title: Set(Some("untitled".to_string())),
        user_id: Set(1),
        descrption: Set(Some("set a discrption".to_string())),
        icon: Set(None),
        cover: Set(None),
        links: Set(links),
        ui_schema: schema,
        note_id: Set(note.last_insert_id.abs()),
        in_archive: Set(false),
        categorie: Set(id as u32),
        ..Default::default()
    };

    Ok(Entity::insert(new).exec(db).await?.last_insert_id as i32)
}
