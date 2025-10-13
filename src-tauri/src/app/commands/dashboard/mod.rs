use std::sync::Arc;

use super::areas::functions;
use crate::DbConnection;
use async_std::sync::Mutex;
use migration::entities::area::{self, Entity, Model};
use sea_orm::EntityTrait;
use tauri::{AppHandle, Manager, State};
use tauri_plugin_store::StoreBuilder;

#[tauri::command]
pub async fn dashboard(
    data: State<'_, Arc<Mutex<DbConnection>>>,
    app: AppHandle,
) -> Result<Model, String> {
    let db = data.lock().await.db.clone().unwrap();
    let store = StoreBuilder::new(app.app_handle(), "main.json").build();
    match store {
        Ok(data) => {
            let value = data.get("dashboard_id");
            match value {
                Some(id) => {
                    let area = functions::find_one(id.as_f64().unwrap() as i32, &db)
                        .await
                        .unwrap();
                    return Ok(area);
                }
                None => {
                    let id = functions::create_area(&db).await.unwrap();
                    data.set("dashboard_id", id);
                    let area = functions::find_one(id, &db).await.unwrap();
                    return Ok(area);
                }
            }
        }
        Err(e) => Err(e.to_string()),
    }
}
