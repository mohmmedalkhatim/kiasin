use migration::entities::area::{ActiveModel, Entity};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait, Set};
use serde_json::json;
pub async fn create_area(db: &DatabaseConnection) -> Result<u32,DbErr> {
    let shema = json!({
        "item":[
            {"id":1,"cols":6,"rows":3},
            {"id":2,"cols":2,"rows":6},
            {"id":3,"cols":3,"rows":3},
            {"id":4,"cols":3,"rows":3},
        ]
    });
    let links = json!({ "list": [] });
    let new = ActiveModel {
        title: Set(Some("untitled".to_string())),
        user_id: Set(1),
        descrption: Set(Some("set a discrption".to_string())),
        icon: Set(None),
        cover: Set(None),
        links: Set(links),
        ui_schema: Set(shema),
        in_archive:Set(false),
        ..Default::default()
    };

    Ok(Entity::insert(new).exec(db).await?.last_insert_id)
}
