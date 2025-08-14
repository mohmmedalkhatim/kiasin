use crate::DbConnection;
use async_std::sync::Mutex;
use migration::entities::db::Model;
use objects::Payload;
use std::sync::Arc;
use tauri::{ipc::Channel, AppHandle, State};
mod functions;
mod objects;

#[tauri::command]
pub async fn database_control(
    app: AppHandle,
    payload: Payload,
    channel: Channel<Vec<Model>>,
    data: State<'_, Arc<Mutex<DbConnection>>>,
) -> Result<(), String> {
    let db = data.lock().await.db.clone().unwrap();
    let database = payload.item;
    match payload.command.as_str() {
        "create" => match functions::create(app, database, &db).await {
            Ok(id) => match functions::get(id, &db).await {
                Ok(item) => {
                    let _ = channel.send(vec![item]);
                    Ok(())
                }
                Err(e) => Err(e.to_string()),
            },
            Err(e) => Err(e.to_string()),
        },
        "delete" => {
            todo!()
        }
        "update" => {
            todo!()
        }
        "list" => {
            todo!()
        }
        "one" => {
            todo!()
        }
        _ => Ok(()),
    }
}
