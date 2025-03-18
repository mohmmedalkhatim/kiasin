use migration::entities::component::{Entity, Model};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait};



pub async fn find_mauy(db:&DatabaseConnection)->Result<Vec<Model>,DbErr> {
    Entity::find().all(db).await
}
pub async fn find_one(id:i32,db:&DatabaseConnection)->Result<Model,DbErr> {
    Ok(Entity::find_by_id(id).one(db).await?.unwrap())
}