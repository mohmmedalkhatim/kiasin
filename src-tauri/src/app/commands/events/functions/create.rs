use migration::entities::event::{ActiveModel, Entity};
use sea_orm::{ActiveValue::Set, DatabaseConnection, DbErr, EntityTrait};

use serde_json::json;
use chrono::{NaiveDate, Utc};

pub async fn create(
    summary: Option<String>,
    start_date: NaiveDate,
    end_date: NaiveDate,
    db: &DatabaseConnection,
) -> Result<(), DbErr> {
    let now = Utc::now();

    let start_json = json!({ "date": start_date.to_string() });
    let end_json = json!({ "date": end_date.to_string() });

    let model = ActiveModel {
        id: Set(uuid::Uuid::max().to_string()), // generate unique ID
        summary: Set(summary),
        start: Set(start_json),
        end: Set(end_json),
        created: Set(Some(now)),
        updated: Set(Some(now)),
        ..Default::default()
    };

    Entity::insert(model).exec(db).await?;

    Ok(())
}
