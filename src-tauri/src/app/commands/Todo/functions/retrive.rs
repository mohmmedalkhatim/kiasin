use migration::{
    entities::todo::{self, Entity, Model},
    Expr,
};
use sea_orm::{DatabaseConnection, EntityTrait, QueryFilter,};

pub async fn find_many(db: &DatabaseConnection) -> Result<Vec<Model>, String> {
    Ok(Entity::find().all(db).await.unwrap())
}
pub async fn find_for_project(
    project_id: i32,
    db: &DatabaseConnection,
) -> Result<Vec<todo::Model>, String> {
    let list = Entity::find()
        .filter(Expr::col(todo::Column::ProjectId).eq(project_id))
        .all(db)
        .await;
    Ok(list.unwrap())
}
pub async fn find_for_area(
    area_id: i32,
    db: &DatabaseConnection,
) -> Result<Vec<todo::Model>, String> {
    let list = Entity::find()
        .filter(Expr::col(todo::Column::AreaId).eq(area_id))
        .all(db)
        .await;
    Ok(list.unwrap())
}
