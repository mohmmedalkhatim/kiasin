use migration::entities::categorie;
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, Set};
use serde_json::json;

use crate::categorie::ActiveModel;

pub async fn init_categories(db: &DatabaseConnection) {
    let res = categorie::Entity::find()
        .filter(categorie::Column::Id.eq(4))
        .one(db)
        .await
        .unwrap();
    match res {
        Some(state) => {
            
        }
        None => {
            let arr = json!({"items":[]});
            let _ = categorie::Entity::insert(ActiveModel {
                name: Set("project".to_string()),
                areas: Set(arr.clone()),
                ..Default::default()
            })
            .exec(db)
            .await;
            let _ = categorie::Entity::insert(ActiveModel {
                name: Set("area".to_string()),
                areas: Set(arr.clone()),
                ..Default::default()
            })
            .exec(db)
            .await;
            let _ = categorie::Entity::insert(ActiveModel {
                name: Set("resource".to_string()),
                areas: Set(arr.clone()),
                ..Default::default()
            })
            .exec(db)
            .await;
            let _ = categorie::Entity::insert(ActiveModel {
                name: Set("archive".to_string()),
                areas: Set(arr.clone()),
                ..Default::default()
            })
            .exec(db)
            .await;
        }
    }
}
