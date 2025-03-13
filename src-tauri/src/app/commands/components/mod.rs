mod objects;
use objects::Payload;

#[tauri::command]
async fn compoents_control(app: tauri::AppHandle,payload:Payload) -> Result<(), String> {

  Ok(())
}