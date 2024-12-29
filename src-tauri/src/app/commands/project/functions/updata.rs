use migration::entities::project::{self,ActiveModel, Entity,};
use sea_orm::{entity::*, DatabaseConnection, DbErr, EntityTrait, QueryFilter, Set};

use crate::app::commands::project::objects::*;

pub async fn updata_project(project_dto: Project,id:i32, db: &DatabaseConnection) -> Result<(), DbErr> {
    let mut icon = None;
    let mut cover = None;
    if project_dto.icon.is_some() {
        icon = Some(
            base64::decode(project_dto.icon.clone().unwrap())
                .expect("there is a problem with the image format"),
        )
    }
    if project_dto.cover.is_some() {
        cover = Some(
            base64::decode(project_dto.cover.clone().unwrap())
                .expect("there is a problem with the image format"),
        )
    }
    let new = ActiveModel {
        title: Set(project_dto.title),
        area_id: Set(Some(1)),
        icon: Set(icon),
        cover: Set(cover),
        ..Default::default()
    };
    let _ = Entity::update(new).filter(project::Column::Id.eq(id)).exec(db).await?;
    Ok(())
}
