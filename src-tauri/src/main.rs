// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use app::database_connection;
use async_std::sync::Mutex;
use sea_orm::DatabaseConnection;

mod app;

struct DbConnection {
    db: Mutex<DatabaseConnection>,
}

#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            app::area_control,
            app::archive_control,
            app::projects_control,
            app::resources_control,
        ])
        .manage(DbConnection {
            db: Mutex::from(database_connection().await),
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
