use crate::DbConnection;
use migration::entities::note::Model;
use objects::Payload;
use std::sync::Arc;
use tauri::{command, ipc::Channel, AppHandle, Emitter, Manager, State};
use tokio::sync::Mutex;
mod functions;
mod objects;

#[command]
pub async fn notes_control(
    payload: Payload,
    channel: Channel<Vec<Model>>,
    data: State<'_, Arc<Mutex<DbConnection>>>,
    app: AppHandle,
) -> Result<(), String> {
    let db = &data.lock().await.db.clone().unwrap();
    let server = app.app_handle();
    match payload.command.as_str() {
        "find" => match payload.id {
            Some(id) => {
                let model = functions::find_one(id, db).await;
                if let Ok(model) = model {
                    let _ = channel.send(vec![model]);
                    return Ok(());
                }
                Err("couldn't find the project".to_string())
            }
            None => Err("you have to add an id".to_string()),
        },
        "create" => match payload.item {
            Some(model) => {
                let _ = functions::create_note(model, db)
                    .await
                    .expect("there is a problem with the database");
                Ok(())
            }
            None => Err("you have add a project".to_string()),
        },
        "delete" => match payload.id {
            Some(id) => {
                let _ = functions::delete_one(db, id);
                let list = functions::find_many(db).await;
                if let Ok(v) = list {
                    return Ok(());
                }
                Ok(())
            }
            None => Err("you have to add an id".to_string()),
        },
        "updata" => match payload.item {
            Some(model) => {
                if let Some(id) = payload.id {
                    let _ = functions::updata_note(model, id, db)
                        .await
                        .expect("there is a problem with the database");
                    return Ok(());
                }
                Err("you have to add an id".to_string())
            }
            None => Err("you have to fill all felid".to_string()),
        },
        "area_notes" => match payload.id {
            Some(id) => {
                let list = functions::find_for_area(id, &db).await;
                if let Ok(list) = list {
                    let _ = channel.send(list);
                }
                Ok(())
            }
            None => Err("you have to enter the area id".to_string()),
        },
        "area_recent"=> match payload.id {
            Some(id) => {
                let list = functions::recent_for_area(id, &db).await;
                if let Ok(list) = list {
                    let _ = server.emit("medias",list);
                }
                Ok(())
            }
            None => Err("you have to enter the area id".to_string()),
        },

        _ => Err("you try to access unregister command \n -create\t -updata\n -delete\t -one\n -project_notes".to_string())
    }
}
