use tauri::command;
mod objects;
mod functions;




#[command]
pub async fn user_control( ) -> Result<(), String> {

  Ok(())
}