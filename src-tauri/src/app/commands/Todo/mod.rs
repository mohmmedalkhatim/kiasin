use std::sync::Arc;

use crate::DbConnection;
use async_std::sync::Mutex;
use migration::entities::todo::Model;
use objects::Payload;
use tauri::{command, ipc::Channel, State};
mod functions;
mod objects;

#[command]
pub async fn todos_control(
    payload: Payload,
    server: Channel<Vec<Model>>,
    data: State<'_, Arc<Mutex<DbConnection>>>,
) -> Result<(), String> {
    let db = data.lock().await.db.clone().unwrap();
    match payload.command.as_str() {
        "create" => match payload.item {
            Some(model) => {
                println!("create todo");
                let id = functions::create_todo(model, &db)
                    .await
                    .expect("there is a problem with the database");
                let todo = functions::find_one(id, &db).await.expect("there a problem when creating an element");
                println!("{:?}",todo);
                let _ = server.send(vec![todo]);

                Ok(())
            }
            None => Err("you have add a todo".to_string()),
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
        "update" => match payload.item {
            Some(model) => {
                    let _ = functions::update_todo(model.clone(), &db)
                        .await
                        .expect("there is a problem with the database");
                  let res = functions::find_one(model.id.unwrap(), &db).await;
                        match res {
                            Ok(state)=>{
                                let _ =  server.send(vec![state]);
                                return Ok(())
                            },
                            Err(e)=>{
                                return Err(e.to_string())
                            }
                        }
                    return Ok(());
            }
            None => Err("you have add item to the payload".to_string()),
        },
        "find"=>match payload.ids{
            Some(state)=>{
                let list = functions::find_list(state, &db).await;
                match list {
                    Ok(res)=>{
                        let _ = server.send(res);
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
                                let _ =  server.send(vec![state]);
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
        _ => Err("you try to acess unregieser command \n -create\t -update\n\t -delete\t -list\n -area_todos".to_string()),
    }
}
