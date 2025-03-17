use migration::entities::area::{Entity, Model};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait};

pub async fn find_one(id: i32, db: &DatabaseConnection) -> Result<Model, DbErr> {
    Ok(Entity::find_by_id(id as u32).one(db).await?.unwrap())
}

pub async fn find_many(db: &DatabaseConnection) -> Result<Vec<Model>, DbErr> {
    let list = Entity::find().all(db).await?;
    Ok(list)
}
