use super::super::objects::Database;
use migration::entities::db::{self, ActiveModel};
use sea_orm::{ActiveValue::Set, DatabaseConnection, DbErr, EntityTrait};
use tauri::AppHandle;

pub async fn create(app: AppHandle, database: Database,db: &DatabaseConnection) -> Result<i32, DbErr> {

    let active_model = ActiveModel {
        name: Set(database.name),
        data: Set(database.data),
        ..Default::default()
    };
    let id  = db::Entity::insert(active_model).exec(db).await?;
    Ok(id.last_insert_id)
}
