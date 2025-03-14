use migration::entities::component::{Entity, Model};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait};



pub async fn find_mauy(db:&DatabaseConnection)->Result<Vec<Model>,DbErr> {
    Entity::find().all(db).await
}