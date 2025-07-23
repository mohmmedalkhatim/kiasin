use std::{sync::Arc, vec};

use async_std::sync::Mutex;
use migration::entities::media::Model;
use objects::Payload;
use tauri::{command, ipc::Channel, State};

use crate::DbConnection;
mod functions;
mod objects;

#[command]
pub async fn media_control(
    payload: Payload,
    data: State<'_, Arc<Mutex<DbConnection>>>,
    channel: Channel<Vec<Model>>,
) -> Result<(), String> {
    let db = data.lock_arc().await.db.clone().unwrap();
    match payload.command.as_str() {
        "create" => match payload.item {
            Some(media) => {
                let model = functions::create_media(media, &db)
                    .await
                    .expect("there is a problem with the database");
                let _ = channel.send(vec![model]);
                Ok(())
            }
            None => Err("you have add a project".to_string()),
        },
        "update" => match payload.item {
            Some(state) => match payload.id {
                Some(id) => {
                    let res = functions::update_media(state, &db, id).await;
                    match res {
                        Ok(_state)=>{
                            Ok(())
                        }
                        Err(e)=>{
                            return Err(e.to_string());
                        }
                    }
                }
                None => Err("you have to include an id".to_string()),
            },
            None => Err("you have to include media file and type".to_string()),
        },
        "delete" => match payload.id {
            Some(id) => {
                let res = functions::delete_one(&db, id).await;
                if let Ok(result) = res {
                    let list = functions::find_many(&db).await;
                    return Ok(result);
                }
                Err("you have to add an id".to_string())
            }
            None => Err("you have to add an id".to_string()),
        },
        "find" => match payload.ids {
            Some(state) => {
                let list = functions::find_list(state, &db).await;
                match list {
                    Ok(model) => {
                        let _ = channel.send(model);
                        Ok(())
                    }
                    Err(e) => {
                        return Err(e.to_string());
                    }
                }
            }
            None => match payload.id {
                Some(id) => {
                    let res = functions::find_one(id, &db).await;
                    match res {
                        Ok(model) => {
                            let _ = channel.send(vec![model]);
                            Ok(())
                        }
                        Err(e) => Err(e.to_string()),
                    }
                }
                None => {
                    let res = functions::find_many(&db).await;
                    match res {
                        Ok(list) => {
                            let _ = channel.send(list);
                            return Ok(())
                        },
                        Err(e)=>{
                            return Err(e.to_string());
                        }
                    }
                }
            },
        },
        _ => Err("you are trying to call unregistered command".to_string()),
    }
}
