use std::collections::HashMap;

use objects::{Payload, Project};
use tauri::{command, ipc::Channel, State};

use crate::DbConnection;
mod functions;
mod objects;

#[command]
pub async fn project_control(payload: Payload,data:State<'_,DbConnection>,server:Channel<Project>) -> Result<(), String> {
    let db = data.db.lock().await;

    let strs: Vec<String> =  Vec::new();
    let mut hash: HashMap<String, Vec<String>> =  HashMap::new();

    match payload.command.as_str() {
        "create" => {
          match payload.item {
              Some(model)=>{
                let  _ = functions::create_project(model, &*db).await.expect("there is a problem with the database");
              Ok(())
              },
              None=>{
                Err("you have add a project".to_string())
              }
          }
        }
        "delete"=>{
          Ok(())
        }
        "create" => {
          match payload.item {
              Some(model)=>{
                let  _ = functions::updata_project(model, &*db).await.expect("there is a problem with the database");
              Ok(())
              },
              None=>{
                Err("you have add a project".to_string())
              }
          }
        }
        _ => {
          Err("".to_string())
        }
    }

}
