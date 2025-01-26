use migration::entities::project::{ActiveModel, Entity};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait, Set};

use crate::app::commands::project::objects::*;

pub async fn create_project(project: Project, db: &DatabaseConnection) -> Result<(), DbErr> {
    let mut icon = None;
    let mut cover = None;
    if project.icon.is_some() {
        icon = Some(
            base64::decode(project.icon.clone().unwrap())
                .expect("there is a problem with the image format"),
        )
    }
    if project.cover.is_some() {
        cover = Some(
            base64::decode(project.cover.clone().unwrap())
                .expect("there is a problem with the image format"),
        )
    }
    let new = ActiveModel {
        title: Set(project.title),
        area_id: Set(Some(1)),
        icon: Set(icon),
        cover: Set(cover),
        ui_schema:Set(project.ui_schema),
        ..Default::default()
    };
    let _ = Entity::insert(new).exec(db).await?;
    Ok(())
}
