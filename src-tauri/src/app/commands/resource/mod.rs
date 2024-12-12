use tauri::command;
mod objects;
mod functions;




#[command]
pub async fn resources_control( ) -> Result<(), String> {

  Ok(())
}