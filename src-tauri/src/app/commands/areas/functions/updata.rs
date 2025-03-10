use migration::entities::area::{self, ActiveModel, Entity, Model};
use sea_orm::{entity::*, DatabaseConnection, DbErr, EntityTrait, QueryFilter, Set};

use crate::app::commands::areas::objects::*;

pub async  fn updata_area(db: &DatabaseConnection,id:i32, area: Area) -> Result<Model, DbErr> {
    let mut cover = None;
    if area.cover.is_some() {
        cover =
            Some(base64::decode(area.cover.clone().unwrap()).expect("there is a formating issue"));
    }
    let mut icon = None;
    if area.icon.is_some() {
        icon =
            Some(base64::decode(area.icon.clone().unwrap()).expect("there is a formating issue"));
    }

    let new = ActiveModel {
        title: Set(area.title),
        user_id: Set(1),
        descrption: Set(area.discription),
        icon: Set(icon),
        cover: Set(cover),
        links: Set(area.links),
        ui_schema:Set(area.ui_schema),
        ..Default::default()
    };
    let new = Entity::update(new).filter(area::Column::Id.eq(id)).exec(db).await?;
    Ok(new)
}
