use migration::entities::user::{Entity, Model};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait};

pub async fn find_one(id: i32, db: &DatabaseConnection) -> Result<Option<Model>, DbErr> {
    Entity::find_by_id(id).one(db).await
}
