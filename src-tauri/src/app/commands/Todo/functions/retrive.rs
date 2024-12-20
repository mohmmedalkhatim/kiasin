use migration::entities::{
    area, db, project,
    todo::{self, Entity, Model},
};
use sea_orm::{DatabaseConnection, EntityTrait, QueryFilter, Related};

pub async fn find_many(db: &DatabaseConnection) -> Result<Vec<Model>, String> {
    Ok(Entity::find().all(db).await.unwrap())
}
pub async fn find_for_project(
    project_id: i32,
    db: &DatabaseConnection,
) -> Result<Vec<todo::Model>, String> {
    let list = project::Entity::find_by_id(project_id)
        .find_with_related(todo::Entity)
        .all(db)
        .await;
    Ok(list.unwrap()[0].1.clone())
}
pub async fn find_for_area(
    area_id: i32,
    db: &DatabaseConnection,
) -> Result<Vec<todo::Model>, String> {
    let list = area::Entity::find_by_id(area_id as u32)
        .find_with_related(todo::Entity)
        .all(db)
        .await;
    Ok(list.unwrap()[0].1.clone())
}
