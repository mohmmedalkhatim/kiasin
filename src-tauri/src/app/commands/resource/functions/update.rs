use super::super::objects::Resource;
use migration::entities::resources::{self, ActiveModel, Entity, Model};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait, QueryFilter, Set,entity::*};

pub async fn update(
    id: i32,
    db: &DatabaseConnection,
    resource: Resource,
) -> Result<Vec<Model>, DbErr> {
    let mut icon = None;
    let mut cover = None;
    if resource.icon.is_some() {
        icon = Some(
            base64::decode(resource.icon.clone().unwrap())
                .expect("there is a problem with the image format"),
        )
    }
    if resource.cover.is_some() {
        cover = Some(
            base64::decode(resource.cover.clone().unwrap())
                .expect("there is a problem with the image format"),
        )
    }
    let active = ActiveModel {
        title: Set(resource.title),
        descrption: Set(resource.discription),
        cover: Set(cover),
        icon: Set(icon),
        ..Default::default()
    };
    let _ = Entity::update(active).filter(resources::Column::Id.eq(id)).exec(db).await?;
    let list = Entity::find().all(db).await?;
    Ok(list)
}
