use chrono::NaiveDate;
use migration::entities::event::{ActiveModel, Entity};
use sea_orm::{ActiveValue::Set, DatabaseConnection, DbErr, EntityTrait};

pub async fn create(start:NaiveDate,end:NaiveDate,db: &DatabaseConnection) -> Result<(), DbErr> {
    let create = chrono::Local::now().date_naive();
    let model = ActiveModel {
        title: Set(Some("untitled".to_string())),
        start:Set(start),
        end:Set(end),
        created: Set(create),
        ..Default::default()
    };
    let _ = Entity::insert(model).exec(db).await;
    Ok(())
}
