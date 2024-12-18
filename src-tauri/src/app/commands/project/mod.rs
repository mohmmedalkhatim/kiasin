use migration::entities::project::Model;
use objects::Payload;
use tauri::{command, ipc::Channel, State};

use crate::DbConnection;
mod functions;
mod objects;

#[command]
pub async fn project_control(payload: Payload,data:State<'_,DbConnection>,server:Channel<Vec<Model>>) -> Result<(), String> {
    let db = data.db.lock().await;

    match payload.command.as_str() {
        "create" => {
          match payload.item {
              Some(model)=>{
                let  _ = functions::create_project(model, &*db).await.expect("there is a problem with the database");
                let _ =server.send(functions::find_many(&db).await.unwrap());
              Ok(())
              },
              None=>{
                Err("you have add a project".to_string())
              }
          }
        }
        "area_projects"=>{

          Ok(())
        },
        "page"=>{
          Ok(())
        }
        "delete"=>{
          Ok(())
        }
        "updata" => {
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
