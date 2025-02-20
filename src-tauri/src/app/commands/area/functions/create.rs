use migration::entities::area::{ActiveModel, Entity};
use sea_orm::{DatabaseConnection, EntityTrait, Set};
use serde_json::json;
pub async fn create_area(db: &DatabaseConnection) -> Result<(), String> {
    let shema = json!({
        "item":[
            {"id":1,"cols":6,"rows":4},
            {"id":2,"cols":2,"rows":8},
            {"id":3,"cols":4,"rows":3},
            {"id":4,"cols":4,"rows":3}
        ]
    });

    let new = ActiveModel {
        title: Set(Some("untitled".to_string())),
        user_id: Set(1),
        descrption: Set(Some("set a discrption".to_string())),
        icon: Set(None),
        cover: Set(None),
        ui_schema: Set(shema),
        ..Default::default()
    };

    let _ = Entity::insert(new).exec(db).await.unwrap();
    Ok(())
}
