use migration::entities::{
    area, db,
    note::{self, Column, Entity, Model},
    project,
};
use sea_orm::{entity::*, DatabaseConnection, DbErr, EntityTrait, QueryFilter, Related};

use crate::{app::commands::note::objects::Payload, DbConnection};

pub async fn find_many(db: &DatabaseConnection) -> Result<Vec<Model>, String> {
    Ok(Entity::find().all(db).await.unwrap())
}
pub async fn find_one(id:i32,db:&DatabaseConnection)->Result<Model,DbErr>{
    let item = Entity::find_by_id(id).one(db).await?;
    Ok(item.unwrap())
}
pub async fn find_for_project(
    project_id: i32,
    db: &DatabaseConnection,
) -> Result<Vec<note::Model>, DbErr> {
    let list = Entity::find().filter(Column::ProjectId.eq(project_id)).all(db).await?;
    Ok(list)
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
