use std::sync::Arc;

use migration::schema::sheet::Model;
use tauri::{State, ipc::Channel};
use tokio::sync::Mutex;

use crate::app::structures::DbConnection;

mod functions;
mod objects;
use objects::Payload;

#[tauri::command]
pub async fn sheets_control(
    payload: Payload,
    db: State<'_, Arc<Mutex<DbConnection>>>,
    channel: Channel<Vec<Model>>,
) -> Result<(), String> {
    let data = db.lock().await.db.clone().unwrap();
    match payload.command.as_str() {
        "create" => {
            let sheet = functions::create_sheet(&data, payload.data.unwrap()).await?;
            let _ = channel.send(vec![sheet]);
            Ok(())
        }
        "retrieve" => match payload.id {
            Some(id) => {
                let v = functions::retrieve_sheet(id.clone(), &data).await?;
                let _ = channel.send(vec![v]);
                Ok(())
            }
            None => Err("you didn't add a payload data".to_string()),
        },
        "update" => match payload.data {
            Some(sheet_data) => {
                let sheet = functions::update_sheet(sheet_data, &data).await?;
                let _ = channel.send(vec![sheet]);
                Ok(())
            }
            None => Err("you didn't add a payload data".to_string()),
        },
        "delete" => match payload.id {
            Some(id) => {
                let _ = functions::delete_sheet(id, &db.lock().await.db.clone().unwrap()).await?;
                Ok(())
            }
            None => Err("you didn't add a payload data".to_string()),
        },
        "list" => {
            let list = functions::list(&db.lock().await.db.clone().unwrap()).await?;
            let _ = channel.send(list);
            Ok(())
        }
        _ => Err("Invalid payload command".to_string()),
        
    }
}
