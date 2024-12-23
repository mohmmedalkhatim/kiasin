use functions::find_one;
use migration::entities::user::Model;
use objects::Payload;
use sea_orm::sqlx::types::uuid::Error;
use tauri::{command, ipc::Channel, State};

use crate::DbConnection;
mod functions;
mod objects;

#[command]
pub async fn user_control(
    payload: Payload,
    server: Channel<Model>,
    data: State<'_, DbConnection>,
) -> Result<(), String> {
    let db = data.db.lock().await;

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
        "one" => {
            let model = functions::find_one(payload.id.unwrap(), &db)
                .await
                .expect("there an error in the database");
            let _ = server.send(model.unwrap());
            Ok(())
        }
        "delete" => {
            let _ = functions::delete_user(payload.id.unwrap(), &db)
                .await
                .unwrap();
            Ok(())
        }
        "updata" => match payload.item {
            Some(state) => {
                let list = functions::updata_user(state, &db).await;
                if let Some(id) = payload.id {
                    let user = functions::find_one(id, &db).await;
                    let _ = server.send(user.expect("some thing went worng").unwrap());
                }
                Ok(())
            }
            None => Err("you have to add upload the user data".to_string()),
        },
        _ => Err("there an error in the database".to_string()),
    }
}
