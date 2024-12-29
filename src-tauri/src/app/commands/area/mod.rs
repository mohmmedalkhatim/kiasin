use crate::DbConnection;
use migration::entities::area::Model;
use objects::{AreaPage, Payload};
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
            let _ = functions::create_area(&db);
            Ok(())
        }
        "updata" => match payload.item {
            Some(area) => {
                if let Some(id) = payload.id {
                    let _ = functions::updata_area(&db, id, area);
                    let list = functions::find_many(&db).await.unwrap();
                    let _ = server.send(list);
                    return Ok(());
                }
                Err("you have to add an id".to_string())
            }
            None => Err("you have to provide an area".to_string()),
        },
        "one" => match payload.id {
            Some(id) => {
                let list = functions::find_one(id, &db).await;
                if let Ok(area) = list {
                    let _ = server.send(vec![area]);
                    return Ok(());
                }
                Err("hello".to_string())
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
                let done = functions::delete_area(id, &db).await;
                match done {
                    Ok(_) => {
                        let _ = server.send(
                            functions::find_many(&db)
                                .await
                                .expect("there an error with the database"),
                        );
                        Ok(())
                    }
                    Err(_) => Err("I didn't found the area".to_string()),
                }
            }
            None => Err("you have to provided an ID".to_string()),
        },
        _ => Err("you are trying to access unregistered command".to_string()),
    }
}
