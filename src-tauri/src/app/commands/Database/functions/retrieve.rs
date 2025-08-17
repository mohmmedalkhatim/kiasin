use migration::entities::db::{self, Model};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait};

pub async fn get(id: i32, db: &DatabaseConnection) -> Result<Model, DbErr> {
    return Ok(db::Entity::find_by_id(id).one(db).await?.unwrap());
}
