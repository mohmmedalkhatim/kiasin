use tauri::command;
mod functions;
mod objects;

#[command]
pub async fn resources_control() -> Result<(), String> {
    Ok(())
}
