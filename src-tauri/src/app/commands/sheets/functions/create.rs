use crate::app::commands::sheets::objects::Sheet;
use base64::prelude::*;
use migration::schema::sheet::{ActiveModel, Entity, Model};
use sea_orm::{ActiveValue::Set, DatabaseConnection, EntityTrait};
pub async fn create_sheet(db: &DatabaseConnection, data: Sheet) -> Result<Model, String> {
    match data.file {
        Some(item) => {
            println!("before decoding");
            let file = BASE64_STANDARD.decode(item).map_err(|err| {
                return err.to_string();
            })?;
            println!("after decoding");
            let active = ActiveModel {
                name: Set(data.name),
                description: Set(data.description),
                file: Set(Some(file)),
                ..Default::default()
            };
            let id = Entity::insert(active)
                .exec(db)
                .await
                .map_err(|err| err.to_string())?;
            println!("{:?}", id);
            let model = Entity::find_by_id(id.last_insert_id)
                .one(db)
                .await
                .map_err(|err| err.to_string())?;
            match model {
                Some(model) => Ok(model),
                None => Err("there is a problem getting the model".to_string()),
            }
        }
        None => Err("there no file prop".to_string()),
    }
}
