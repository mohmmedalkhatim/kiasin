use std::{sync::Arc, vec};

use crate::DbConnection;
use async_std::sync::Mutex;
use migration::entities::area::Model;
pub use objects::{Area, Payload};
use tauri::{command, ipc::Channel, AppHandle, Emitter, State};
mod functions;
mod objects;

#[command]
pub async fn areas_control(
    app: AppHandle,
    payload: Payload,
    data: State<'_, Arc<Mutex<DbConnection>>>,
    channel: Channel<Vec<Model>>,
) -> Result<(), String> {
    let db = data.lock().await.db.clone().unwrap();
    functions::init_categories(&db).await;
    match payload.command.as_str() {
        "create" => {
            let res = functions::create_area(&db, payload.id.unwrap()).await;
            match res {
                Ok(id) => {
                    let state = functions::find_one(id, &db).await;
                    let _ = channel.send(vec![state.unwrap()]);
                    Ok(())
                }
                Err(e) => Err(e.to_string()),
            }
        }
        "update" => match payload.item {
            Some(area) => {
                if let Some(id) = payload.id {
                    let data = functions::updata_area(&db, id, area).await;
                    match data {
                        Ok(state) => {
                            let _ = channel.send(vec![state]);
                            return Ok(());
                        }
                        Err(e) => return Err(e.to_string()),
                    }
                }
                Err("you have to add an id".to_string())
            }
            None => Err("you have to provide an area".to_string()),
        },
        "find" => match payload.id {
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
                let list = functions::find_many(&db).await;
                match list {
                    Ok(state) => {
                        let _ = channel.send(state);
                        Ok(())
                    }
                    Err(e) => Err(e.to_string()),
                }
            }
        },

        "delete_one" => match payload.id {
            Some(id) => {
                let done = functions::delete_area(id, &db).await;
                match done {
                    Ok(_) => Ok(()),
                    Err(_) => Err("I didn't found the area".to_string()),
                }
            }
            None => Err("you have to provided an ID".to_string()),
        },
        _ => {
            println!(
                "you are trying to access unregistered command {:?}",
                payload
            );
            Ok(())
        }
    }
}
