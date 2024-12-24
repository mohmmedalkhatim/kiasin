use super::super::objects::Resource;
use migration::entities::resources::{self, ActiveModel, Entity, Model};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait, QueryFilter, Set,entity::*};

pub async fn updata(
    id: u32,
    db: &DatabaseConnection,
    resource: Resource,
) -> Result<Vec<Model>, DbErr> {
    let cover = None;
    if let Some(s) = resource.cover {}
    let icon = None;
    if let Some(s) = resource.icon {}

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
