use migration::schema::sheet::{Entity, Model};
use sea_orm::{DatabaseConnection, EntityTrait};

pub async fn retrieve_sheet(id: i32, db: &DatabaseConnection) -> Result<Model, String> {
    let query = Entity::find_by_id(id)
        .one(db)
        .await
        .map_err(|e| format!("Error retrieving sheet: {}", e))?;
    match query {
        Some(sheet) => Ok(sheet),
        None => Err(format!("Sheet with id {} not found", id)),
    }
}
pub async fn list(db: &DatabaseConnection) -> Result<Vec<Model>, String> {
    let query = Entity::find()
        .all(db)
         .await
        .map_err(|e| format!("Error retrieving sheet: {}", e))?;
    Ok(query)
}
