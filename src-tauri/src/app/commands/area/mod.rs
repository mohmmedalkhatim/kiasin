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
    channel: Channel<Vec<Model>>,
) -> Result<(), String> {
    let db = data.lock().await.db.clone().unwrap();
    let server = app.app_handle();
    match payload.command.as_str() {
        "create" => {
            let res = functions::create_area(&db).await;
            match res {
                Ok(id) => {
                    let one = functions::find_one(id as i32, &db).await.unwrap();
                    let _ = channel.send(vec![one]);
                }
                Err(e) => {
                    println!("{}", e.to_string())
                }
            }
            Ok(())
        }
        "updata" => match payload.item {
            Some(area) => {
                if let Some(id) = payload.id {
                    let a = functions::updata_area(&db, id, area);
                    let list = functions::find_many(&db).await.unwrap();
                    let _ = channel.send(list);

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
                    let _ = channel.send(state);
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
                        let _ = channel.send(
                            functions::find_many(&db)
                                .await
                                .expect("there an error with the database"),
                        );
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
