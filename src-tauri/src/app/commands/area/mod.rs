use std::sync::Arc;

use crate::DbConnection;
use async_std::sync::Mutex;
pub use objects::{Area, Payload};
use tauri::{command, AppHandle, Emitter, Manager, State};
mod functions;
mod objects;

#[command]
pub async fn areas_control(
    app: AppHandle,
    payload: Payload,
    data: State<'_, Arc<Mutex<DbConnection>>>,
) -> Result<(), String> {
    let server = app.app_handle();
    let db = data.lock().await.db.clone().unwrap();
    match payload.command.as_str() {
        "create" => {
            let res = functions::create_area(&db).await;
            match res {
                Ok(id) => {
                    let one = functions::find_one(id as i32, &db).await.unwrap();
                    let _ = server.emit("area", one);
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
                    let _ = server.emit("areas", list);
                    
                    return Ok(());
                }
                Err("you have to add an id".to_string())
            }
            None => Err("you have to provide an area".to_string()),
        },
        "one" => match payload.id {
            Some(id) => {
                let list = functions::find_one(id, &db).await;
                if let Ok(area) = list {
                    let _ = server.emit("area", area);
                    return Ok(());
                }
                Err("hello this an error fron getarea".to_string())
            }
            None => Err("you have to provided an ID".to_string()),
        },

        "many" => {
            let list = functions::find_many(&db).await;
            match list {
                Ok(state) => {
                    let _ = server.emit("areas", state);
                }
                Err(e) => {
                    println!("{}", e.to_string())
                }
            }
            Ok(())
        }
        "Page" => match payload.id {
            Some(id) => {
                let page = functions::area_page(id, &db).await.unwrap();
                let _ = server.emit("area", page);
                Ok(())
            }
            None => Err("you have to provided an ID".to_string()),
        },
        "delete_one" => match payload.id {
            Some(id) => {
                let done = functions::delete_area(id, &db).await;
                match done {
                    Ok(_) => {
                        let _ = server.emit(
                            "areas",
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
