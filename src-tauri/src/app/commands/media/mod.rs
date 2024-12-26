use std::collections::HashMap;

use migration::entities::media::Model;
use objects::{Media, Payload};
use tauri::{command, ipc::Channel, State};

use crate::DbConnection;
mod functions;
mod objects;

#[command]
pub async fn media_control(
    payload: Payload,
    data: State<'_, DbConnection>,
    server: Channel<Model>,
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
        "delete" => Ok(()),
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
