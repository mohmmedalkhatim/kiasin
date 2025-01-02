use migration::entities::note::Model;
use objects::Payload;
use tauri::{command, ipc::Channel, State};
use crate::DbConnection;
mod functions;
mod objects;

#[command]
pub async fn note_control(
    payload: Payload,
    data: State<'_, DbConnection>,
    server: Channel<Vec<Model>>,
) -> Result<(), String> {
    let db = &data.db.lock().await;

    match payload.command.as_str() {
        "one" => match payload.id {
            Some(id) => {
                let model = functions::find_one(id, db).await;
                if let Ok(model) = model {
                    let _ = server.send(vec![model]);
                    return Ok(());
                }
                Err("couldn't find the project".to_string())
            }
            None => Err("you have to add an id".to_string()),
        },
        "create" => match payload.item {
            Some(model) => {
                let _ = functions::create_note(model, db)
                    .await
                    .expect("there is a problem with the database");
                Ok(())
            }
            None => Err("you have add a project".to_string()),
        },
        "delete" => match payload.id {
            Some(id) => {
                let _ = functions::delete_one(db, id);
                let list = functions::find_many(db).await;
                if let Ok(v) = list {
                    let _ = server.send(v);
                    return Ok(());
                }
                Ok(())
            }
            None => Err("you have to add an id".to_string()),
        },
        "updata" => match payload.item {
            Some(model) => {
                if let Some(id) = payload.id {
                    let _ = functions::updata_note(model, id, db)
                        .await
                        .expect("there is a problem with the database");
                    return Ok(());
                }
                Err("you have to add an id".to_string())
            }
            None => Err("you have to fill all feild".to_string()),
        },
        "project_notes" => match payload.id {
            Some(id) => {
                let list = functions::find_for_project(id, &db).await;
                if let Ok(list) = list {
                    let _ = server.send(list);
                }
                Ok(())
            }
            None => Err("you have to enter the project id".to_string()),
        },
        "area_notes" => match payload.id {
            Some(id) => {
                let list = functions::find_for_area(id, &db).await;
                if let Ok(list) = list {
                    let _ = server.send(list);
                }
                Ok(())
            }
            None => Err("you have to enter the project id".to_string()),
        },
        "area_recent"=> match payload.id {
            Some(id) => {
                let list = functions::recent_for_area(id, &db).await;
                if let Ok(list) = list {
                    let _ = server.send(list);
                }
                Ok(())
            }
            None => Err("you have to enter the area id".to_string()),
        },
        "project_recent"=> match payload.id {
            Some(id) => {
                let list = functions::recent_for_project(id, &db).await;
                if let Ok(list) = list {
                    let _ = server.send(list);
                }
                Ok(())
            }
            None => Err("you have to enter the project id".to_string()),
        },

        _ => Err("you try to acess unregieser command \n -create\t -updata\n -delete\t -one\n -project_notes".to_string())
    }
}
