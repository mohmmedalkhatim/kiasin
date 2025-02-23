// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use app::database_connection;
use sea_orm::DatabaseConnection;
use tauri::{path::BaseDirectory, Manager};
mod app;

struct DbConnection {
    db: DatabaseConnection,
}

#[tokio::main]
async fn main() {
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
        .setup(|app| {
            let database = app
                .app_handle()
                .path()
                .resolve("{}/database/test.db", BaseDirectory::Data)
                .unwrap();

            let db = tauri::async_runtime::block_on(async {
                return database_connection(database.display().to_string()).await;
            });
            let db = DbConnection { db };
            app.manage(db);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
