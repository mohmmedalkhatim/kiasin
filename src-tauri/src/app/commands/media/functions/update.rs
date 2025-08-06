use migration::entities::media::{ActiveModel, Entity};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait, Set};

use crate::app::commands::media::objects::Media;

pub async fn update_media(media: Media, db: &DatabaseConnection, id: i32) -> Result<i32, DbErr> {
    let file = base64::decode(media.file).expect("problem with file format");
    let new = ActiveModel {
        id: Set(id),
        url: Set(media.url),
        area_id: Set(media.area_id),
        file: Set(file),
        note_id: Set(media.note_id),
        project_id: Set(media.project_id),
        media_type: Set(media.media_type),
        ..Default::default()
    };
    let id = Entity::update(new).exec(db).await?;
    Ok(id.id)
}
