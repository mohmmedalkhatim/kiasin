use migration::entities::area::{ActiveModel, Entity};
use sea_orm::{DatabaseConnection, EntityTrait, Set};

use crate::app::commands::area::objects::*;

pub fn updata_area(db: &DatabaseConnection, area: Area) -> Result<(), String> {
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
        ..Default::default()
    };
    let _ = Entity::insert(new).exec(db);

    Ok(())
}
