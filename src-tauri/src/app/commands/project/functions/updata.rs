use migration::entities::project::{ActiveModel, Entity};
use sea_orm::{DatabaseConnection, EntityTrait, Set};

use crate::app::commands::project::objects::*;

pub async fn updata_project(project: Project, db: &DatabaseConnection) -> Result<(), String> {
    let mut icon = None;
    let mut cover = None;
    if project.cover.is_some() {}
    if project.icon.is_some() {
        icon = Some(
            (base64::decode(project.icon.clone().unwrap())
                .expect("there is a problem with the image format")),
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
        ..Default::default()
    };
    let _ = Entity::update(new).exec(db);
    Ok(())
}
