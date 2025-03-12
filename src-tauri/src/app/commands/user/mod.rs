use crate::DbConnection;
use async_std::sync::Mutex;
use migration::entities::user::Model;
use objects::Payload;
use std::sync::Arc;
use tauri::{command, ipc::Channel, AppHandle, Emitter, Manager, State};
mod functions;
mod objects;

#[command]
pub async fn user_control(
    payload: Payload,
    data: State<'_, Arc<Mutex<DbConnection>>>,
    app: AppHandle,
) -> Result<(), String> {
    let db = data.lock().await.db.clone().unwrap();
    let server = app.app_handle();
    match payload.command.as_str() {
        "create" => match payload.item {
            Some(state) => {
                let id = functions::create_user(state, &db).await;
                if let Ok(id) = id {
                    let user = functions::find_one(id, &db).await;
                    let _ = server.emit("user", user.expect("some thing went worng").unwrap());
                }
                Ok(())
            }
            None => Err("you have to add upload the user data".to_string()),
        },
        "one" => match payload.id {
            Some(id) => {
                let mode = functions::find_one(id, &db).await;
                if let Ok(model) = mode {
                    let _ = server.emit("user", model.unwrap());
                    return Ok(());
                }
                Err("couldn't find an id".to_string())
            }
            None => Err("you have to add an id".to_string()),
        },

        "delete" => match payload.id {
            Some(id) => {
                let res = functions::delete_user(id, &db).await;
                if let Ok(respone) = res {
                    return Ok(respone);
                }
                Err("s".to_string())
            }
            None => Err("went wrong".to_string()),
        },
        "updata" => match payload.item {
            Some(state) => {
                let list = functions::updata_user(state, &db).await;
                if let Some(id) = payload.id {
                    let user = functions::find_one(id, &db).await;
                    let _ = server.emit("user", user.expect("some thing went worng").expect("some thing went worng"));
                    return Ok(list?);
                }
                Err("som".to_string())
            }
            None => Err("you have to add upload the user data".to_string()),
        },
        _ => Err(
            "you are trying to access unrigusterd command \n -create\t -one\t\n -delete\t -updata"
                .to_string(),
        ),
    }
}
