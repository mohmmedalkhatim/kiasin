use migration::entities::{area::Entity, note, todo};
use sea_orm::{entity::*, DatabaseConnection, DbErr, EntityTrait, QueryFilter};

pub async fn delete_area(id: i32, db: &DatabaseConnection) -> Result<(), DbErr> {
    let _ = Entity::delete_by_id(id as u32).exec(db).await?;
    let _ = note::Entity::delete_many().filter(note::Column::AreaId.eq(id));
    let _ = todo::Entity::delete_many().filter(todo::Column::AreaId.eq(id));
    Ok(())
}
