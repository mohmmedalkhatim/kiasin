use migration::entities::{area, db, project::{self, Entity}};
use sea_orm::{DatabaseConnection, DbErr, EntityOrSelect, EntityTrait, QueryTrait, Related};

use crate::{app::commands::project::objects::Payload, DbConnection};




pub async fn find_many(db:&DatabaseConnection)->Result<Vec<project::Model>,String> {
    Ok(Entity::find().all(db).await.unwrap())
}
pub async fn area_projects(id:u32,db:&DatabaseConnection)->Result<Vec<project::Model>,DbErr>{
    
    todo!()
}