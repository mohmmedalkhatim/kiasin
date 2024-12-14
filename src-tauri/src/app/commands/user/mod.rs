use async_std::sync::Mutex;
use functions::find_one;
use migration::entities::user::Model;
use objects::{Payload, User};
use tauri::{command, ipc::Channel, State};

use crate::DbConnection;
mod objects;
mod functions;




#[command]
pub async fn user_control(payload:Payload,server:Channel<Model>,db:State<'_,Mutex<DbConnection>>) -> Result<(), String> {
  let db = db.lock().await.db.get_mut().to_owned();
  match payload.command.as_str() {
      "create"=>{
        let _ = functions::create_user(payload.item.unwrap(),&db).await.expect("database errr");
        let model = find_one(payload.id.unwrap(), &db).await.expect("error in the Database");
        let _ = server.send(model.unwrap());
        Ok(())
      }
      "one"=>{
        let model= functions::find_one(payload.id.unwrap(), &db).await.expect("there an error in the database");
        let _ = server.send(model.unwrap());
        Ok(())
      }
      "delete"=>{
        let _ = functions::delete_user(payload.id.unwrap(), &db).await.unwrap();
        Ok(())
      }
      "updata"=>{
        let _ = functions::updata_user(payload.item.unwrap());
        Ok(())
      }
      _=>{
        Err("there an error in the database".to_string())
      }
  }
}