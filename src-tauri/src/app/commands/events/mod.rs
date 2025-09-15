use std::sync::Arc;

use crate::DbConnection;
use async_std::sync::Mutex;
use migration::entities::event::Model;
use objects::Payload;
use tauri::{ipc::Channel, State};
mod functions;
mod objects;

#[tauri::command]
pub async fn events_control(
    payload: Payload,
    channel: Channel<Vec<Model>>,
    data: State<'_, Arc<Mutex<DbConnection>>>,
) -> Result<(), String> {
    let db = data.lock_arc().await.db.clone().unwrap();
    match payload.command.as_str() {
        "all" => match functions::all(&db).await {
            Ok(res) => {
                let _ = channel.send(res);
                return Ok(());
            }
            Err(e) => return Err(e.to_string()),
        },
        "create" => match payload.item {
            Some(state) => {
                let res = functions::create(state.start, state.end, &db).await;
                match res {
                    Ok(_) => return Ok(()),
                    Err(e) => return Err(e.to_string()),
                }
            }
            None => return Err("you have to add data to create the events".to_string()),
        },
        "update" => match payload.item {
            Some(state) => {
                let res = functions::update(state, &db).await;
                match res {
                    Ok(_) => return Ok(()),
                    Err(e) => return Err(e.to_string()),
                }
            }
            None => return Err("you have to add data to create the events".to_string()),
        },
        _ => {}
    }
    Ok(())
}
