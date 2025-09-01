use migration::entities::event::{ActiveModel, Entity};
use sea_orm::{ActiveValue::Set, DatabaseConnection, DbErr, EntityTrait};
use super::super::objects;

pub async fn update(data:objects::Event,db: &DatabaseConnection) -> Result<(), DbErr> {
    let date = chrono::Local::now().date_naive();
    let model = ActiveModel {
        id:Set(data.id.unwrap()),
        title: Set(data.title),
        description:Set(data.description),
        start:Set(data.start),
        end:Set(data.end), 
        updated:Set(Some(date)),
        ..Default::default()
    };
    let _ = Entity::update(model).exec(db).await;
    Ok(())
}
