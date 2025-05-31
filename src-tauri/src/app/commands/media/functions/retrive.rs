use migration::entities::media::{Entity, Model};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait};

pub async fn find_many(db: &DatabaseConnection) -> Result<Vec<Model>, DbErr> {
    Ok(Entity::find().all(db).await.unwrap())
}
pub async fn find_list(ids: Vec<i32>, db: &DatabaseConnection) -> Result<Vec<Model>, DbErr> {
    let mut list = Vec::new();
    for id in ids {
        let item = Entity::find_by_id(id).one(db).await?.unwrap();
        list.push(item);
    }
    Ok(list)
}
pub async fn find_one(id: i32, db: &DatabaseConnection) -> Result<Model, DbErr> {
    Ok(Entity::find_by_id(id).one(db).await?.unwrap())
}
