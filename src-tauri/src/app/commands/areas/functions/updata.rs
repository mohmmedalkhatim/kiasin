use migration::entities::area::{ActiveModel, self, Entity};
use sea_orm::{entity::*, DatabaseConnection, EntityTrait, QueryFilter, Set};

use crate::app::commands::areas::objects::*;

pub fn updata_area(db: &DatabaseConnection,id:i32, area: Area) -> Result<(), String> {
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
        ui_schema:Set(area.ui_schema),
        ..Default::default()
    };
    let _ = Entity::update(new).filter(area::Column::Id.eq(id)).exec(db);

    Ok(())
}
