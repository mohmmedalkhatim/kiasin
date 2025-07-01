use std::sync::Arc;

use crate::{app::commands::areas::Area, DbConnection};
use async_std::sync::Mutex;
use migration::entities::area::{Entity, Model};
use sea_orm::{ EntityTrait};
use tauri::State;
mod create;

#[tauri::command]
pub async fn dashboard(data: State<'_, Arc<Mutex<DbConnection>>>) -> Result<Model, String> {
    let db = data.lock().await.db.clone().unwrap();
    let id = 1;
    let res = Entity::find_by_id(id as u32).one(&db).await;
    match res {
        Ok(data) => match data {
            Some(model) => Ok(model),
            None => {
                let res = create::create_area(&db, 1).await;
                match res {
                    Ok(model) => {
                        Ok(model)   
                    }
                    Err(e) => Err(e.to_string()),
                }
            }
        },
        Err(e) => Err(e.to_string()),
    }
}
