use migration::entities::component::ActiveModel;
use sea_orm::{DatabaseConnection, DbErr, EntityTrait, Set};

use crate::app::commands::components::objects::Card;

use super::card::Entity;

pub async fn create(db: &DatabaseConnection, item: Card) -> Result<i32, DbErr> {
    let active = ActiveModel {
        id: Set(item.id),
        name: Set(item.name),
        cols: Set(item.cols),
        rows: Set(item.rows),
        content: Set(item.content),
    };
    Ok(Entity::insert(active).exec(db).await?.last_insert_id)
}
