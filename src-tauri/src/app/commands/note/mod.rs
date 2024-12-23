use std::collections::HashMap;

use migration::entities::note::Model;
use objects::{Note, Payload};
use tauri::{command, ipc::Channel, State};

use crate::DbConnection;
mod functions;
mod objects;

#[command]
pub async fn note_control(
    payload: Payload,
    data: State<'_, DbConnection>,
    server: Channel<Vec<Model>>,
) -> Result<(), String> {
    let db = &data.db.lock().await;

    match payload.command.as_str() {
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
                let list = functions::find_many(db);
                Ok(())
            }
            None => Err("you have to add an id".to_string()),
        },
        "updata" => match payload.item {
            Some(model) => {
                let _ = functions::updata_note(model, db)
                    .await
                    .expect("there is a problem with the database");
                Ok(())
            }
            None => Err("you have add a project".to_string()),
        },
        "project_notes" => match payload.id {
            Some(id) => {
                let list = functions::find_for_project(id, &db).await;
                if let Ok(list) = list {
                    let _ = server.send(list);
                }
                Ok(())
            }
            None => Err("you have to enter the project id".to_string()),
        },
        _ => Err("".to_string()),
    }
}
