use migration::entities::todo::{Entity, Model};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait};

pub async fn find_all(db: &DatabaseConnection) -> Result<Vec<Model>, String> {
    Ok(Entity::find().all(db).await.unwrap())
}
pub async fn find_one(id: i32, db: &DatabaseConnection) -> Result<Model, DbErr> {
    Ok(Entity::find_by_id(id).one(db).await?.unwrap())
}
pub async fn find_list(ids: Vec<i32>, db: &DatabaseConnection) -> Result<Vec<Model>, DbErr> {
    let mut list = Vec::new();
    println!("{:?}", ids);
    for id in ids {
        let todo = Entity::find_by_id(id).one(db).await?.unwrap();
        list.push(todo);
    }
    Ok(list)
}
