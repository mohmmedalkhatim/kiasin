use crate::DbConnection;
use migration::entities::area::Model;
use objects::{Area, AreaPage, Payload};
use tauri::{command, ipc::Channel, State};
mod functions;
mod objects;

#[command]
pub async fn area_control(
    payload: Payload,
    data: State<'_, DbConnection>,
    server: Channel<Vec<Model>>,
    page_server: Channel<AreaPage>,
) -> Result<(), String> {
    let db = data.db.lock().await;
    match payload.command.as_str() {
        "create" => {
            let _ = functions::create_area(&*db);
            Ok(())
        }
        "updata" => match payload.item {
            Some(area) => {
                let _ = functions::updata_area(&db, area);
                let list = functions::find_many(&db).await;
                let _ = server.send(list.unwrap());
                Ok(())
            }
            None => Err("you have to provide an area".to_string()),
        },
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
        "Page" => match payload.id {
            Some(id) => {
                let page = functions::find_apage(id, &db).await.unwrap();
                let _ = page_server.send(page);
                Ok(())
            }
            None => Err("you have to provided an ID".to_string()),
        },
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
