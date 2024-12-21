use migration::entities::area::{ActiveModel, Entity};
use sea_orm::{DatabaseConnection, EntityTrait, Set};


pub fn create_area(db: &DatabaseConnection) -> Result<(), String> {
    
    let new = ActiveModel {
        title: Set(Some("untitled".to_string())),
        user_id: Set(1),
        descrption: Set(Some("set a discrption".to_string())),
        icon: Set(None),
        cover: Set(None),
        ..Default::default()
    };
    let _ = Entity::insert(new).exec(db);

    Ok(())
}
