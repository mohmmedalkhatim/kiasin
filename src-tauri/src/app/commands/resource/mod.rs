use crate::DbConnection;
use functions::delete;
use migration::entities::resources::Model;
use tauri::{command, ipc::Channel, State};
mod functions;
mod objects;
use objects::*;

#[command]
pub async fn resources_control(
    payload: Payload,
    data: State<'_, DbConnection>,
    server: Channel<Vec<Model>>,
) -> Result<(), String> {
    let db = &data.db.lock().await;
    match payload.command.as_str() {
        "create" => {
            match payload.item {
                Some(state) => {
                    let _ = functions::create_area(state, db);
                }
                None => {}
            }
            Ok(())
        }
        "one" => match payload.id {
            Some(id) => {
                let res = functions::one(id, db).await;
                match res {
                    Ok(resources) =>  {
                        let _ = server.send(vec![resources]);
                        return Ok(());
                    }
                    Err(e) =>{
                        Err(e.to_string())
                    }  
                }
            }
            None => {
                Err("you have to add enter the id".to_string())
            }
        },
        "delete" =>match payload.id {
            Some(id) =>{
                let _  = functions::delete(id, db);
                let res = functions::many(db).await;
                if let Ok(list)= res {
                   let _ = server.send(list); 
                   return Ok(());
                }  
                Err("there a problem with the database".to_string())
            }
            None=>{
                Err("you have to enter the id".to_string())
            }
        }
        _ =>Err("you are trying to access an registerd command".to_string()),
    }
}
