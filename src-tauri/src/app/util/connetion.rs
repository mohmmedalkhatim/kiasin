use sea_orm::{Database, DatabaseConnection};



pub async fn database_connection(s:String) -> DatabaseConnection {
    let url = format!("sqlite://{}",s);

    Database::connect(url).await.unwrap()
}
