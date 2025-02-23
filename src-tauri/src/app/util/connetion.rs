use sea_orm::{Database, DatabaseConnection};



pub async fn database_connection(s:String) -> DatabaseConnection {

    Database::connect(s).await.unwrap()
}
