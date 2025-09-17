use migration::entities::db::Entity;
use sea_orm::{DatabaseConnection, DbErr, DeleteResult, EntityTrait};

pub async fn delete(id: i32, db: &DatabaseConnection) -> Result<DeleteResult, DbErr> {
    Ok(Entity::delete_by_id(id).exec(db).await?)
}
