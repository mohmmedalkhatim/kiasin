use migration::entities::media::{ActiveModel, Entity};
use sea_orm::{DatabaseConnection, EntityTrait, Set};

use crate::app::commands::media::objects::Media;


pub async fn create_media(media: Media,db:&DatabaseConnection) -> Result<(), String> {
    let file =  base64::decode(media.buffer).expect("problem with file format");
    let new = ActiveModel {
        project_id: Set(media.project_id.unwrap()),
        buffer: Set(file),
        media_type: Set(media.structure),
        ..Default::default()
    };
    let note  = Entity::insert(new).exec(db).await;
    
    Ok(())
}
