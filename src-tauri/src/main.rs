// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use app::database_connection;
use sea_orm::DatabaseConnection;
use tokio::sync::Mutex;

mod app;

struct DbConnection {
    db: DatabaseConnection,
}

#[tokio::main]
async fn main() {
    let db = DbConnection {
        db: database_connection().await,
    };
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            app::area_control,
            app::project_control,
            app::resources_control,
            app::user_control,
            app::note_control,
            app::todo_control,
            app::media_control,
            app::dashboard,
        ])
        .manage(Mutex::from(db))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
