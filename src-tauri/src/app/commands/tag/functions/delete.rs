use migration::entities::tag::Entity;
use sea_orm::{DatabaseConnection, DbErr, EntityTrait};

async fn delete_tag(db: DatabaseConnection, id: i32) -> Result<(), DbErr> {
    let _ = Entity::delete_by_id(id).exec(&db).await?;
    Ok(())
}
