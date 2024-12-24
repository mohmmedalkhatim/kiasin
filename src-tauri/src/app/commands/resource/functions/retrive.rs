use migration::entities::resources::{Entity, Model};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait};

pub async fn one(id: u32, db: &DatabaseConnection) -> Result<Model, DbErr> {
    Ok(Entity::find_by_id(id).one(db).await?.unwrap())
}

pub async fn many(id: u32, db: &DatabaseConnection) -> Result<Vec<Model>, DbErr> {
    let a =Entity::find().all(db).await?;
    Ok(a)
}