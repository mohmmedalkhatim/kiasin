use migration::entities::db::{self, ActiveModel};
use sea_orm::{ActiveValue::Set, DatabaseConnection, DbErr, EntityTrait};
use serde_json::json;

pub async fn create(db: &DatabaseConnection) -> Result<i32, DbErr> {
    let active_model = ActiveModel {
        name: Set("untitled".to_string()),
        data: Set(
            json!({"fields":["name","number","position"],"records":[]}),
        ),
        ..Default::default()
    };
    let id = db::Entity::insert(active_model).exec(db).await?;
    Ok(id.last_insert_id)
}
