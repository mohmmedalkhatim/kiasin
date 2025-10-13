use migration::entities::area::{Column, Entity, Model};
use sea_orm::{ColumnTrait, DatabaseConnection, DbErr, EntityTrait, QueryFilter};
use serde_json::json;

pub async fn find_one(id: i32, db: &DatabaseConnection) -> Result<Model, DbErr> {
    Ok(Entity::find_by_id(id as u32).one(db).await?.unwrap())
}

pub async fn find_many(db: &DatabaseConnection) -> Result<Vec<Model>, DbErr> {
    let mut list = Entity::find().all(db).await?;
    let transformed_list = list
        .iter_mut()
        .map(|area| {
            let mut new = area.clone();
            new.ui_schema = json!(null); // Use `null` if the schema is intentionally empty
            new
        })
        .collect::<Vec<Model>>();
    Ok(transformed_list)
}

