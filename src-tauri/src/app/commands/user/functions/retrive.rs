use migration::entities::{db, user::{Entity, Model}};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait};

use crate::app::commands::user;




pub async fn find_one(id:i32,db:&DatabaseConnection)->Result<Option<Model>,DbErr> {
    Entity::find_by_id(id).one(db).await
}