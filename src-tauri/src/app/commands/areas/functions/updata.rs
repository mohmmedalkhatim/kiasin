use migration::entities::area::{self, ActiveModel, Entity, Model};
use sea_orm::{entity::*, DatabaseConnection, DbErr, EntityTrait, QueryFilter, Set};

use crate::app::commands::areas::objects::*;

pub async fn updata_area(db: &DatabaseConnection, id: i32, area: Area) -> Result<Model, DbErr> {
    let cover = None;
    let icon = None;

    let new = ActiveModel {
        id: Set(id as u32),
        title: Set(area.title),
        user_id: Set(1),
        description: Set(area.description),
        icon: Set(icon),
        cover: Set(cover),
        links: Set(area.links),
        note_id: Set(area.note_id),
        ui_schema: Set(area.ui_schema),
        ..Default::default()
    };
    let new = Entity::update(new)
        .filter(area::Column::Id.eq(id))
        .exec(db)
        .await?;
    Ok(new)
}
