use crate::app::commands::resource::objects::*;
use base64;
use migration::entities::{resources::ActiveModel, resources::Entity};
use sea_orm::{DatabaseConnection, EntityTrait, Set};

pub async fn create_area(resource: Resource, db: &DatabaseConnection) -> Result<(), String> {
    let mut icon = None;
    let mut cover = None;
    if let Some(source) = resource.icon {
        icon = Some(base64::decode(source).map_err(|e| format!("Failed to decode icon: {}", e))?);
    }

    if let Some(source) = resource.cover {
        cover = Some(base64::decode(source).map_err(|e| format!("Failed to decode cover: {}", e))?);
    }
    let new = ActiveModel {
        title: Set(resource.title),
        user_id: Set(1),
        descrption: Set(resource.discription),
        icon: Set(icon),
        cover: Set(cover),
        ..Default::default()
    };
    let _ = Entity::insert(new).exec(db).await;
    Ok(())
}
