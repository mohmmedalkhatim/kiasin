use migration::schema::sheet::{ActiveModel, Entity, Model};
use sea_orm::{ActiveValue::Set, DatabaseConnection, EntityTrait};
use base64::prelude::*;
use crate::app::commands::sheets::objects;

use super::retrieve_sheet;

pub async fn update_sheet(data: objects::Sheet, db: &DatabaseConnection) -> Result<Model, String> {
    let file = BASE64_STANDARD.decode(data.file.unwrap()).map_err(|err| err.to_string())?;
    let id = data.id.unwrap();
    let active = ActiveModel {
        id: Set(id),
        name: Set(data.name),
        description: Set(data.description),
        file: Set(Some(file)),
        ..Default::default()
    };
    Entity::update(active)
        .exec(db)
        .await
        .map_err(|e| e.to_string())?;
    let sheet = retrieve_sheet(id, db).await?;
    Ok(sheet)
}
