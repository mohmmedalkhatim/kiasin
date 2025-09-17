use crate::DbConnection;
use async_std::sync::Mutex;
use migration::entities::db::Model;
use objects::Payload;
use std::sync::Arc;
use tauri::{ipc::Channel, State};
mod functions;
mod objects;

#[tauri::command]
pub async fn database_control(
    payload: Payload,
    channel: Channel<Vec<Model>>,
    data: State<'_, Arc<Mutex<DbConnection>>>,
) -> Result<(), String> {
    let db = data.lock().await.db.clone().unwrap();
    let database = payload.item;
    match payload.command.as_str() {
        "create" => match functions::create(&db).await {
            Ok(id) => match functions::get(id, &db).await {
                Ok(item) => {
                    let _ = channel.send(vec![item]);
                    Ok(())
                }
                Err(e) => Err(e.to_string()),
            },
            Err(e) => Err(e.to_string()),
        },
        "all" => match functions::all(&db).await {
            Ok(list) => {
                let _ = channel.send(list);
                Ok(())
            }
            Err(e) => Err(e.to_string()),
        },
        "delete" => match payload.id {
            Some(id) => match functions::delete(id, &db).await {
                Ok(_done) => Ok(()),
                Err(e) => Err(e.to_string()),
            },
            None => Err("you have to send an id".to_string()),
        },
        "update" => match database {
            Some(model) => {
                let _ = functions::update(model, &db);
                Ok(())
            }
            None => Err("you have to add a payload".to_string()),
        },
        "list" => match payload.ids {
            Some(ids) => match functions::list(ids, &db).await {
                Ok(list) => {
                    let _ = channel.send(list);
                    Ok(())
                }
                Err(e) => {
                    return Err(e.to_string());
                }
            },
            None => todo!(),
        },
        "one" => match payload.id {
            Some(id) => match functions::get(id, &db).await {
                Ok(model) => {
                    let _ = channel.send(vec![model]);
                    Ok(())
                }
                Err(massage) => Err(massage.to_string()),
            },
            None => Err("you have to add an id".to_string()),
        },
        _ => Ok(()),
    }
}
