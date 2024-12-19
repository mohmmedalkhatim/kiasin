use migration::entities::project::{self, Entity};
use sea_orm::entity::*;
use sea_orm::{Condition, DatabaseConnection, DbErr, EntityTrait, QueryFilter};

pub async fn find_many(db: &DatabaseConnection) -> Result<Vec<project::Model>, String> {
    Ok(Entity::find().all(db).await.unwrap())
}
pub async fn area_projects(id: u32, db: &DatabaseConnection) -> Result<Vec<project::Model>, DbErr> {
    let list = Entity::find()
        .filter(Condition::all().add(project::Column::AreaId.eq(id)))
        .all(db)
        .await?;
    Ok(list)
}
