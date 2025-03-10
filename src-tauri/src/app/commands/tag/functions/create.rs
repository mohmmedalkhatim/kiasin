use migration::entities::tag::{ActiveModel, Entity};
use migration::DbErr;
use sea_orm::{prelude::*, DatabaseConnection, Set};
use serde_json::json;

pub async fn create_tag(db: &DatabaseConnection, tag_name: &str) -> Result<(), DbErr> {
    let tag = ActiveModel {
        name: Set(tag_name.to_owned()),
        ids: Set(json!("{items:[]}")),
        ..Default::default()
    };
    let _ = Entity::insert(tag).exec(db).await?;
    Ok(())
}
