use migration::entities::{
    area,
    note::{self, Entity, Model},
    project,
};
use sea_orm::{DatabaseConnection, EntityTrait};

use crate::app::commands::media::objects::Payload;

pub async fn find_many(db: &DatabaseConnection) -> Result<Vec<Model>, String> {
    Ok(Entity::find().all(db).await.unwrap())
}
pub async fn find_for_project(
    project_id: i32,
    db: &DatabaseConnection,
) -> Result<Vec<note::Model>, String> {
    let list = project::Entity::find_by_id(project_id)
        .find_with_related(note::Entity)
        .all(db)
        .await;
    Ok(list.unwrap()[0].1.clone())
}
pub async fn find_for_area(
    area_id: i32,
    db: &DatabaseConnection,
) -> Result<Vec<note::Model>, String> {
    let list = area::Entity::find_by_id(area_id as u32)
        .find_with_related(note::Entity)
        .all(db)
        .await;
    Ok(list.unwrap()[0].1.clone())
}
