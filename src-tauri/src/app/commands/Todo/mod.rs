use async_std::sync::Mutex;
use objects::{Payload, Todo};
use tauri::{command, AppHandle, Emitter, Manager, State};
use crate::DbConnection;
mod functions;
mod objects;

#[command]
pub async fn todo_control(
    payload: Payload,
    data: State<'_, Mutex<DbConnection>>,
    app:AppHandle
) -> Result<(), String> {
    let db = data.lock().await.db.clone();
    let server = app.app_handle();
    match payload.command.as_str() {
        "create" => match payload.item {
            Some(model) => {
                let _ = functions::create_note(model, &db)
                    .await
                    .expect("there is a problem with the database");
                Ok(())
            }
            None => Err("you have add a project".to_string()),
        },
        "list" => {
            let list = functions::find_many(&db).await;
            match list {
                Ok(state)=>{
                   let _  = server.emit("todos",state);
                },
                Err(e)=>{
                    return Err(e);
                }
            }
            Ok(())
        },
        "delete" => match payload.id {
            Some(id) => {
                let _ = functions::delete_one(&db, id);
                Ok(())
            }
            None => Err("you have to add an id".to_string()),
        },
        "updata" => match payload.item {
            Some(model) => {
                if let Some(id) = payload.id {
                    let _ = functions::updata_note(model, id, &db)
                        .await
                        .expect("there is a problem with the database");
                    return Ok(());
                }

                Err("you have to add an id".to_string())
            }
            None => Err("you have add a project".to_string()),
        },
        "area_todos"=>{
            Ok(())
        },
        _ => Err("you try to acess unregieser command \n -create\t -updata\n\t -delete\t -list\n -area_todos".to_string()),
    }
}
