use async_std::sync::Mutex;
use objects::Payload;
use tauri::{command, AppHandle, Emitter, Manager, State};

use crate::DbConnection;
mod functions;
mod objects;

#[command]
pub async fn media_control(
    payload: Payload,
    data: State<'_, Mutex<DbConnection>>,
    app:AppHandle
) -> Result<(), String> {
    let db = data.lock().await.db.clone();
    let server = app.app_handle();
    match payload.command.as_str() {
        "create" => match payload.item {
            Some(model) => {
                let _ = functions::create_media(model, &db)
                    .await
                    .expect("there is a problem with the database");
                Ok(())
            }
            None => Err("you have add a project".to_string()),
        },
        "delete" => match payload.id {
            Some(id) => {
                let res = functions::delete_one(&db, id).await;
                if let Ok(result) = res {
                    let list = functions::find_many(&db).await;
                    match list {
                        Ok(v) => {
                            let _ = server.emit("media",v);
                        }
                        Err(e) => {
                            return Err(e);
                        }
                    }
                    return Ok(result);
                }
                Err("you have to add an id".to_string())
            }
            None => Err("you have to add an id".to_string()),
        },
        "list" => {
            let list = functions::find_many(&db).await;
            match list {
                Ok(v) => {
                    let _ = server.emit("media",v);
                    Ok(())
                }
                Err(e) => Err(e),
            }
        },
        _ => Err("you are trying to call unregisted command".to_string()),
    }
}
