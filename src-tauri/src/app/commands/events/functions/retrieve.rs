use migration::entities::event::{Entity, Model};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait};

pub async fn one(id: i32, db: &DatabaseConnection) -> Result<Model, DbErr> {
    Ok(Entity::find_by_id(id).one(db).await?.unwrap())
}
pub async fn list(ids: Vec<i32>, db: &DatabaseConnection) -> Result<Vec<Model>, DbErr> {
    let mut list = Vec::new();
    for id in ids {
        list.push(Entity::find_by_id(id).one(db).await?.unwrap());
    }
    Ok(list)
}
