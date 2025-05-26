use objects::Payload;

mod functions;

mod objects;

#[tauri::command]
async fn tag_control(app: tauri::AppHandle, payload: Payload) -> Result<(), String> {
    Ok(())
}
