use objects::{Payload, Project};
use tauri::{command, ipc::Channel, State};

use crate::DbConnection;
mod functions;
mod objects;

#[command]
pub async fn project_control(payload: Payload,data:State<'_,DbConnection>,server:Channel<Project>) -> Result<(), String> {
    let db = data.db.lock().await;
    match payload.command.as_str() {
        "create" => {
          match payload.item {
              Some(model)=>{
                let  _ = functions::create_project(model, &*db).await.expect("there is a problem with the database");
              },
              None=>{}
          }
        }
        _ => {}
    }

    Ok(())
}
