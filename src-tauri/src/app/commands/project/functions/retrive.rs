use migration::entities::project::{self, Entity};
use migration::entities::{note, todo};
use sea_orm::entity::*;
use sea_orm::{Condition, DatabaseConnection, DbErr, EntityTrait, QueryFilter};

use crate::app::commands::project::objects::ProjectPage;

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
pub async fn project_page(id: i32, db: &DatabaseConnection) -> Result<Option<ProjectPage>, DbErr> {
    let project = Entity::find_by_id(id).one(db).await?;
    match project {
        Some(model) => {
            let notes = note::Entity::find()
                .filter(Condition::all().add(note::Column::ProjectId.eq(model.id)))
                .all(db)
                .await?;
            let todos = todo::Entity::find()
                .filter(Condition::all().add(todo::Column::ProjectId.eq(model.id)))
                .all(db)
                .await?;
            Ok(Some(ProjectPage::new(model, todos, notes)))
        }
        None => Ok(None),
    }
}
