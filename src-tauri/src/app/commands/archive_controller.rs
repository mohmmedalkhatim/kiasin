use tauri::command;



#[command]
pub async fn archive_control()->Result<(), String> {
    Ok(())
}