use migration::entities::user::Entity;
use sea_orm::{DatabaseConnection, DbErr, EntityTrait};

pub async fn delete_user(id: i32, db: &DatabaseConnection) -> Result<(), DbErr> {
    let a = Entity::delete_by_id(id).exec(db).await?;
    Ok(())
}
