use tauri::command;
mod objects;
mod functions;




#[command]
pub async fn archive_control( ) -> Result<(), String> {

  Ok(())
}
