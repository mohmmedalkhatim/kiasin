use migration::entities::{area::Entity, note, project, todo};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait, QueryFilter,entity::* };


pub async fn delete_area(id: i32, db: &DatabaseConnection) -> Result<(), DbErr> {

    let _ = Entity::delete_by_id(id as u32).exec(db).await?;
    let _ = project::Entity::delete_many().filter(project::Column::AreaId.eq(id));
    let _ = note::Entity::delete_many().filter(note::Column::AreaId.eq(id));
    let _ = todo::Entity::delete_many().filter(todo::Column::AreaId.eq(id));
    Ok(())
}
