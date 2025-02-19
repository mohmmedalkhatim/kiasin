use migration::entities::project::Model;
use objects::{Payload, ProjectPage};
use tauri::{command, ipc::Channel, AppHandle, Emitter, Manager, State};
use tokio::sync::Mutex;

use crate::DbConnection;
mod functions;
mod objects;

#[command]
pub async fn project_control(
    payload: Payload,
    data: State<'_, Mutex<DbConnection>>,
    app:AppHandle,
) -> Result<(), String> {
    let db = data.lock().await.db.clone();
    let server = app.app_handle();
    match payload.command.as_str() {
        "create" => match payload.item {
            Some(model) => {
                let _ = functions::create_project(model, &db)
                    .await
                    .expect("there is a problem with the database");
                let _ = server.emit("projects",functions::find_many(&db).await.unwrap());
                Ok(())
            }
            None => Err("you have add a project".to_string()),
        },
        "area_projects" => match payload.id {
            Some(state) => {
                let list = functions::area_projects(state as u32, &db).await;
                let _ = server.emit("projects",list.unwrap());
                Ok(())
            }
            None => Err("you have to add an id to the payload".to_string()),
        },
        "page" => match payload.id {
            Some(id) => {
                let page = functions::project_page(id, &db).await;
                match page {
                    Ok(state) => match state {
                        Some(n) => {
                            server.emit("project",n);
                            Ok(())
                        }
                        None => Err(format!("there no project with the format {}", id)),
                    },
                    Err(_) => Err("there and error with database".to_string()),
                }
            }
            None => Err("you have to add an id".to_string()),
        },
        "delete" => {
            let _ = functions::delete_one(&db, payload.id.expect(""));

            Ok(())
        }
        "updata" => match payload.item {
            Some(model) => {
                if let Some(id) = payload.id {
                    let _ = functions::updata_project(model,id, &db)
                    .await
                    .expect("there is a problem with the database");
                    return Ok(());
                }
                Err("you have to add an id".to_string())
            }
            None => Err("you have add a project".to_string()),
        },
        _ => Err("you try to acess unregieser command \n -create\t -updata\n -delete\t -page\n -area_projects".to_string())
    }
}
