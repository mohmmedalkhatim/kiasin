use migration::entities::{db, project::{self, Entity}};
use sea_orm::{DatabaseConnection, EntityTrait};

use crate::{app::commands::project::objects::Payload, DbConnection};




pub async fn find_many(db:&DatabaseConnection)->Result<Vec<project::Model>,String> {
    Ok(Entity::find().all(db).await.unwrap())
}