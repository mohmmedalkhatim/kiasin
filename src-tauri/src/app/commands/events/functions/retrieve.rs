use migration::entities::event::{Entity, Model};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait};

pub async fn one(id: String, db: &DatabaseConnection) -> Result<Model, DbErr> {
    Ok(Entity::find_by_id(id).one(db).await?.unwrap())
}
pub async fn list(ids: Vec<String>, db: &DatabaseConnection) -> Result<Vec<Model>, DbErr> {
    let mut list = Vec::new();
    for id in ids {
        list.push(Entity::find_by_id(id).one(db).await?.unwrap());
    }
    Ok(list)
}

pub async fn all(db: &DatabaseConnection) -> Result<Vec<Model>, DbErr> {
    Ok(Entity::find().all(db).await?)
}
