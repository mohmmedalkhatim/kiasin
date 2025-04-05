use migration::entities::card::Entity;
use sea_orm::{DatabaseConnection, DbErr, DeleteResult, EntityTrait};

async fn delete(id: i32, db: &DatabaseConnection) -> Result<(), DbErr> {
    let res = Entity::delete_by_id(id).exec(db).await?;
    Ok(())
}
