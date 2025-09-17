use migration::entities::db::{self, Model};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait};

pub async fn get(id: i32, db: &DatabaseConnection) -> Result<Model, DbErr> {
    return Ok(db::Entity::find_by_id(id).one(db).await?.unwrap());
}
pub async fn all(db: &DatabaseConnection) -> Result<Vec<Model>, DbErr> {
    return Ok(db::Entity::find().all(db).await?);
}

pub async fn list(ids: Vec<i32>, db: &DatabaseConnection) -> Result<Vec<Model>, DbErr> {
    let mut res = Vec::new();
    for id in ids {
        res.push(db::Entity::find_by_id(id).one(db).await?.unwrap());
    }
    Ok(res)
}
