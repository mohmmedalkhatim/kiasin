use migration::entities::media::{ActiveModel, Entity, Model};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait, Set};

use crate::app::commands::media::objects::Media;

pub async fn create_media(media: Media, db: &DatabaseConnection) -> Result<Model, DbErr> {
    let file = base64::decode(media.file).expect("problem with file format");
    let new = ActiveModel {
        url: Set(media.url),
        file: Set(file),
        area_id: Set(media.area_id),
        note_id: Set(media.note_id),
        project_id: Set(media.project_id),
        media_type: Set(media.media_type),
        ..Default::default()
    };
    let id = Entity::insert(new).exec(db).await?;
    let media = Entity::find_by_id(id.last_insert_id)
        .one(db)
        .await?
        .unwrap();
    Ok(media)
}
