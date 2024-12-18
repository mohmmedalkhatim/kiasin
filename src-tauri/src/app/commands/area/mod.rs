use crate::DbConnection;
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
    let db = data.db.lock().await;
    match payload.command.as_str() {
        "create" => {
            let _ = functions::create_area(&*db);
            Ok(())
        }
        "updata" => {
            match payload.item {
                Some(area) => {
                    let _ = functions::updata_area(&db, area);
                    let list = functions::find_many(&db).await;
                    let _ = server.send(list.unwrap());
                    Ok(())
                }
                None => Err("you have to provide an area".to_string()),
            }
        }
        "one" => match payload.id {
            Some(id) => {
                let list = functions::find_one(id, &db).await;
                let _ = server.send(vec![list.expect("coudn't find the error")]);
                Ok(())
            }
            None => Err("you have to provided an ID".to_string()),
        },

        "many" => {
            let list = functions::find_many(&db)
                .await
                .expect("there a error in the database");
            let _ = server.send(list);
            Ok(())
        }
        "delete_one" => match payload.id {
            Some(id) => {
                let list = functions::delete_area(id, &db).await;
                let _ = server.send(functions::find_many(&db).await.unwrap());
                Ok(())
            }
            None => Err("you have to provided an ID".to_string()),
        },
        _ => Err("you are trying to access unregistered command".to_string()),
    }
}
