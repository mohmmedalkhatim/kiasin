use migration::entities::media::{Entity, Model};
use sea_orm::{DatabaseConnection, EntityTrait};

pub async fn find_many(db: &DatabaseConnection) -> Result<Vec<Model>, String> {
    Ok(Entity::find().all(db).await.unwrap())
}
