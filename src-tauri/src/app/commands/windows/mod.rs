use tauri::Runtime;

#[tauri::command]
pub async fn window_control<R: Runtime>(
    window: tauri::Window<R>,
    command: String,
) -> Result<(), String> {
    match command.as_str() {
        "close" => {
            let _ = window.close();
        },
        "max" => {
            let _ = window.maximize();
        },
        "min" => {
            let _ = window.minimize();
        },
        _ => {}
    }
    Ok(())
}
