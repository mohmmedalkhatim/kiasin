use crate::DbConnection;
use functions::{find_many, find_one};
use migration::entities::area::Model;
use objects::Payload;
use tauri::{command, ipc::Channel, State};
mod functions;
mod objects;

#[command]
pub async fn area_control(
    payload: Payload,
    data: State<'_, DbConnection>,
    server: Channel<Vec<Model>>,
) -> Result<(), String> {
    let db = data.inner().db.lock().await;
    match payload.command.as_str() {
        "create" => {
            let _ = functions::create_area(&db);
            Ok(())
        }
        "updata" => {
            let _ = functions::updata_area(&db, payload.item.unwrap());
            let list = functions::find_many(&db).await;
            let _ = server.send(list.unwrap());
            Ok(())
        }
        "one" => {
            let list = functions::find_one(payload.id.unwrap(), &db).await;
            let _ = server.send(vec![list.expect("coudn't find the error")]);
            Ok(())
        }

        "many" => {
            let list = functions::find_many(&db)
                .await
                .expect("there a error in the database");
            let _ = server.send(list);
            Ok(())
        }
        _ => {
          Err("you are trying to access unregistered command".to_string())
        }
    }
}
