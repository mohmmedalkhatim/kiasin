use migration::entities::todo::{self, ActiveModel, Entity};
use sea_orm::{entity::*, DatabaseConnection, DbErr, EntityTrait, QueryFilter, Set};

use crate::app::commands::todo::Todo;

pub async fn updata_note(todo: Todo, db: &DatabaseConnection) -> Result<(), DbErr> {
    let time = chrono::Local::now();
    let new = ActiveModel {
        id: Set(todo.id.unwrap()),
        title: Set(todo.title),
        area_id: Set(todo.area_id),
        checked: Set(todo.checked.unwrap()),
        ..Default::default()
    };
    let _ = Entity::update(new)
        .exec(db)
        .await?;
    Ok(())
}
