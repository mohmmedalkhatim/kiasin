use std::sync::{Arc, Mutex};

use crate::DbConnection;
use migration::entities::todo::Model;
use objects::Payload;
use tauri::{command, ipc::Channel, AppHandle, Emitter, Manager, State};
mod functions;
mod objects;

#[command]
pub async fn todo_control(
    payload: Payload,
    server: Channel<Vec<Model>>,
    data: State<'_, Arc<Mutex<DbConnection>>>,
) -> Result<(), String> {
    let db = data.lock().unwrap().db.clone().unwrap();
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
        "all" => {
            let list = functions::find_all(&db).await;
            match list {
                Ok(state)=>{
                   let _  = server.send(state);
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
                    let _ = functions::updata_note(model, &db)
                        .await
                        .expect("there is a problem with the database");
                    return Ok(());
            }
            None => Err("you have add item to the payload".to_string()),
        },
        "find"=>match payload.ids{
            Some(state)=>{
                let list = functions::find_list(state, &db).await;
                match list {
                    Ok(res)=>{
                        server.send(res);
                        return Ok(());
                    },
                    Err(e)=>{
                        return Err(e.to_string());
                    }
                }
            },
            None=>{
                match payload.id {
                    Some(id)=>{
                        let res = functions::find_one(id, &db).await;
                        match res {
                            Ok(state)=>{
                                server.send(vec![state]);
                                return Ok(())
                            },
                            Err(e)=>{
                                return Err(e.to_string())
                            }
                        }
                    },
                    None=>{
                        Err("you have to add an id".to_string())
                    }
                }
            }
        },
        "area_todos"=>{
            Ok(())
        },
        _ => Err("you try to acess unregieser command \n -create\t -updata\n\t -delete\t -list\n -area_todos".to_string()),
    }
}
