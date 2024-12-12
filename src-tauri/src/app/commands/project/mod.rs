use tauri::command;
mod objects;
mod functions;




#[command]
pub async fn project_control( ) -> Result<(), String> {

  Ok(())
}