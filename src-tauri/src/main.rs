// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use async_std::sync::Mutex;
use migration::MigratorTrait;
use sea_orm::DatabaseConnection;
use std::sync::Arc;
use tauri::{path::BaseDirectory, Manager};
mod app;

struct DbConnection {
    db: Option<DatabaseConnection>,
}

#[tokio::main]
async fn main() {

    #[cfg(debug_assertions)]
    let devtools = tauri_plugin_devtools::init();

    let mut builder = tauri::Builder::default();

    #[cfg(debug_assertions)]
    {
        builder = builder.plugin(devtools);
    }

    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            let window = app.get_webview_window("main").expect("no main window");
            window.show().expect("there is an error");
            window.maximize().expect("there is an error");
        }));
    }
    builder
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_sql::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            app::areas_control,
            app::user_control,
            app::notes_control,
            app::todos_control,
            app::media_control,
            app::dashboard,
            app::database_control,
            app::window_control,
            app::events_control,
        ])
        .setup(|app| {
            let database_url = app
                .app_handle()
                .path()
                .resolve("Database\\test.db", BaseDirectory::AppData)
                .unwrap();
            let temp_url = app
                .app_handle()
                .path()
                .resolve("temp\\index.db", BaseDirectory::AppData)
                .unwrap();
            std::fs::create_dir_all(&temp_url.parent().unwrap()).unwrap();
            std::fs::File::create(&temp_url).unwrap();
            if !database_url.exists() {
                std::fs::create_dir_all(database_url.parent().unwrap()).unwrap();
                std::fs::File::create(&database_url).unwrap();
            }
            let database = Arc::new(Mutex::new(DbConnection { db: None }));
            let shadow = database.clone();
            tauri::async_runtime::spawn(async move {
                shadow.lock_arc().await.db =
                    Some(app::database_connection(database_url.display().to_string()).await);
                let _ = migration::Migrator::up(&shadow.lock_arc().await.db.clone().unwrap(), None)
                    .await;
            });
            app.manage(database);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
