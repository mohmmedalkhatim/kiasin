// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::sync::Arc;

use async_std::sync::Mutex;
use sea_orm::DatabaseConnection;
use tauri::{path::BaseDirectory, Manager};
mod app;

struct DbConnection {
    db: Option<DatabaseConnection>,
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
            let database_url = app
                .app_handle()
                .path()
                .resolve("kiasin\\Database\\test.db", BaseDirectory::Data)
                .unwrap();
            let database = Arc::new(Mutex::new(DbConnection { db: None }));
            let shadow = database.clone();
            tauri::async_runtime::spawn(async move {
                shadow.lock_arc().await.db = Some(app::database_connection(database_url.display().to_string()).await)
            });
            app.manage(database);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
