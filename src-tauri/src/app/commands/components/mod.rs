mod functions;
mod objects;
use async_std::{channel, sync::Mutex};
use functions;
use migration::{entities::{component::Model, db}, Function};
use objects::Payload;
use sea_orm::{sqlx::types::uuid::Error, DatabaseConnection};
use std::sync::Arc;
use tauri::{ipc::Channel, Manager};

use crate::DbConnection;

#[tauri::command]
async fn compoents_control(
    app: tauri::AppHandle,
    payload: Payload,
    channel: Channel<Vec<Model>>,
) -> Result<(), String> {
    let state = app.state::<Arc<Mutex<DbConnection>>>();
    let db = state.get_mut().db.unwrap();

    match payload.command.as_str() {
        "many" => {
            let list = functions::find_mauy().await;
            match list {
                Ok(state) => {
                  let a = channel.send(data);
                }
                Err(e) => {
                  Err(e.to_string());
                }
            }
        }
        "create" => {
            match payload.item {
                Some(state)=>{},
                None=>{}
            }
         let item =  functions::create(&db, item);
        }
        "update" => {}
        "delete" => {}
        _ => {
            println!("database connaction")
        }
    }

    Ok(())
}
