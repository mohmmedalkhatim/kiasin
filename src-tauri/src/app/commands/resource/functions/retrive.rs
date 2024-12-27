use migration::entities::resources::{Entity, Model};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait};

pub async fn one(id: i32, db: &DatabaseConnection) -> Result<Model, DbErr> {
    Ok(Entity::find_by_id(id).one(db).await?.unwrap())
}

pub async fn many(db: &DatabaseConnection) -> Result<Vec<Model>, DbErr> {
    let a =Entity::find().all(db).await?;
    Ok(a)
}