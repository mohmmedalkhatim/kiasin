mod functions;
mod objects;
use async_std::sync::Mutex;
use migration::entities::component::Model;
use objects::Payload;
use std::sync::Arc;
use tauri::{ipc::Channel, Emitter, Manager};
use crate::DbConnection;


#[tauri::command]
async fn compoents_control(
    app: tauri::AppHandle,
    payload: Payload,
    channel: Channel<Vec<Model>>,
) -> Result<(), String> {
    let state = app.state::<Arc<Mutex<DbConnection>>>();
    let db = state.lock().await.db.clone().unwrap();

    match payload.command.as_str() {
        "many" => match payload.id {
            Some(id) => {
                let res = functions::find_one(id, &db).await;
                match res {
                    Ok(model) => {
                        let _ = app.emit("area", model);
                        Ok(())
                    }
                    Err(e) => Err(e.to_string()),
                }
            }
            None => {
                let list = functions::find_mauy(&db).await;
                match list {
                    Ok(state) => {
                        let a = channel.send(state);
                        Ok(())
                    }
                    Err(e) => Err(e.to_string()),
                }
            }
        },
        "update" => match payload.item {
            Some(state) => {
                let item = functions::update(state, &db).await;
                Ok(())
            }
            None => Err("you have o".to_string()),
        },
        "create" => Ok(()),
        "delete" => Ok(()),
        _ => Err("database connaction".to_string()),
    }
}
