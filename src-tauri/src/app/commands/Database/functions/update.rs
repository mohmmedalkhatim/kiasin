use migration::entities::db::{ActiveModel, Entity, Model};
use sea_orm::{ActiveValue::Set, DatabaseConnection, DbErr, EntityTrait};

use crate::app::commands::database::objects::Database;

pub async fn update(model: Database, db: &DatabaseConnection) -> Result<Model, DbErr> {
    let active = ActiveModel {
        id: Set(model.id),
        name: Set(model.name),
        data: Set(model.data),
        ..Default::default()
    };
    Ok(Entity::update(active).exec(db).await?)
}
