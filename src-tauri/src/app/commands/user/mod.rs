use async_std::sync::Mutex;
use migration::entities::user::Model;
use objects::Payload;
use tauri::{command, ipc::Channel, State};

use crate::DbConnection;
mod functions;
mod objects;

#[command]
pub async fn user_control(
    payload: Payload,
    server: Channel<Model>,
    data: State<'_, Mutex<DbConnection>>,
) -> Result<(), String> {
    let db = data.lock().await.db.clone();

    match payload.command.as_str() {
        "create" => match payload.item {
            Some(state) => {
                let _ = functions::create_user(state, &db).await;
                if let Some(id) = payload.id {
                    let user = functions::find_one(id, &db).await;
                    let _ = server.send(user.expect("some thing went worng").unwrap());
                }
                Ok(())
            }
            None => Err("you have to add upload the user data".to_string()),
        },
        "one" => match payload.id {
            Some(id)=>{
                let mode = functions::find_one(id, &db)
                .await;
                if let Ok(model) =mode {
                let _  =server.send(model.unwrap());
                 return Ok(());
                }
                Err("couldn't find an id".to_string())
            }
            None=>{
                Err("you have to add an id".to_string())
            }

        }
        
        "delete" => {
            match payload.id{
                Some(id)=>{
                    let res = functions::delete_user(id, &db)
                    .await;
                    if let Ok(respone) = res {
                        return Ok(respone);
                    }
                    Err("s".to_string())
                },
                None=>{
                    Err("went wrong".to_string())
                }

            }
    
        },
        "updata" => match payload.item {
            Some(state) => {
                let list = functions::updata_user(state, &db).await;
                if let Some(id) = payload.id {
                    let user = functions::find_one(id, &db).await;
                    let _ = server.send(user.expect("some thing went worng").unwrap());
                    return Ok(list?);
                }
                Err("som".to_string())
            }
            None => Err("you have to add upload the user data".to_string()),
        },
        _ => Err("you are trying to access unrigusterd command \n -create\t -one\t\n -delete\t -updata".to_string())

    }
}
