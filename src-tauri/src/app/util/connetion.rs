use sea_orm::{Database, DatabaseConnection};

pub async fn database_connection() -> DatabaseConnection {
    let s = "sqlite://../database/test.db";
    Database::connect(s).await.unwrap()
}
