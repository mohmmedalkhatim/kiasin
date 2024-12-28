use migration::entities::media::Model;
use objects::Payload;
use tauri::{command, ipc::Channel, State};

use crate::DbConnection;
mod functions;
mod objects;

#[command]
pub async fn media_control(
    payload: Payload,
    data: State<'_, DbConnection>,
    server: Channel<Vec<Model>>,
) -> Result<(), String> {
    let db = data.db.lock().await;

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
                            let _ = server.send(v);
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
                    let _ = server.send(v);
                    Ok(())
                }
                Err(e) => Err(e),
            }
        }
        "updata" => match payload.item {
            Some(model) => {
                let _ = functions::updata_note(model, &db)
                    .await
                    .expect("there is a problem with the database");
                Ok(())
            }
            None => Err("you have add a project".to_string()),
        },
        _ => Err("".to_string()),
    }
}
