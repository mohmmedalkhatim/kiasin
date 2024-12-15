use migration::entities::db;

use crate::{app::commands::project::objects::Payload, DbConnection};




fn find_many(payload:Payload,db:std::sync::Mutex<DbConnection>)->Result<(),String> {
    match  payload.command.as_str(){
        "create"=>{
            Ok(())
        },
        "many"=>{
            Ok(())
        },
        _=>{
            Ok(())
        },
    }
}