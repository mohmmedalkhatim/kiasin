use migration::entities::media::Entity;
use sea_orm::{DatabaseConnection, DbErr, EntityTrait};

pub async fn delete_one(db: &DatabaseConnection, id: i32) -> Result<(), DbErr> {
    Entity::delete_by_id(id)
        .exec(db)
        .await?;

        Ok(())
}
