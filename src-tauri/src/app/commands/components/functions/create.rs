use migration::entities::component::ActiveModel;
use sea_orm::{DbErr, EntityTrait};

use crate::app::commands::components::objects::Component;

use super::component::Entity;

pub async fn create(db: &DatabaseConnaction, item: Component) -> Result<i32, DbErr> {
    let active = ActiveModel {
        id: Set(item.id),
        name: Set(item.name),
        content: Set(item.content),
    };
    Entity::insert(active).exec(db).await?.last_insert_id
}
