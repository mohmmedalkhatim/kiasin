use migration::entities::todo::{ActiveModel, Entity};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait, Set};

use crate::app::commands::todo::objects::Todo;

pub async fn update_todo(todo: Todo, db: &DatabaseConnection) -> Result<(), DbErr> {
    let time = chrono::Local::now();
    let new = ActiveModel {
        id: Set(todo.id.unwrap()),
        title: Set(todo.title),
        area_id: Set(todo.area_id),
        checked: Set(todo.checked.unwrap()),
        update: Set(Some(time.date_naive())),
        ..Default::default()
    };
    let _ = Entity::update(new).exec(db).await?;
    Ok(())
}
