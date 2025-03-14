use migration::entities::component::{Entity, Model};
use sea_orm::{DbErr, EntityTrait};



pub async fn find_mauy()->Result<Vec<Model>,DbErr> {
    Entity::find().all(db).await
}