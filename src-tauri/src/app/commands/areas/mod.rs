use std::{sync::Arc, vec};

use crate::DbConnection;
use async_std::sync::Mutex;
use migration::entities::area::Model;
pub use objects::{Area, Payload};
use tauri::{command, ipc::Channel, AppHandle, Emitter, Manager, State};
mod functions;
mod objects;

#[command]
pub async fn areas_control(
    app: AppHandle,
    payload: Payload,
    data: State<'_, Arc<Mutex<DbConnection>>>,
    channel: Option<Channel<Vec<Model>>>,
) -> Result<(), String> {
    let db = data.lock().await.db.clone().unwrap();
    let server = app.app_handle();
    match payload.command.as_str() {
        "create" => {
            let res = functions::create_area(&db).await;
            match res {
                Ok(id) => {
                    Ok(())
                }
                Err(e) => {
                    Err(e.to_string())
                }
            }
        }
        "updata" => match payload.item {
            Some(area) => {
                if let Some(id) = payload.id {
                    let a = functions::updata_area(&db, id, area);
                    return Ok(());
                }
                Err("you have to add an id".to_string())
            }
            None => Err("you have to provide an area".to_string()),
        },            
        "many" => {
            let list = functions::find_many(&db).await;
            match list {
                Ok(state) => {
                    let _ = channel.unwrap().send(state);
                }
                Err(e) => {
                    println!("{}", e.to_string())
                }
            }
            Ok(())
        }

        "delete_one" => match payload.id {
            Some(id) => {
                let done = functions::delete_area(id, &db).await;
                match done {
                    Ok(_) => {
                        Ok(())
                    }
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
