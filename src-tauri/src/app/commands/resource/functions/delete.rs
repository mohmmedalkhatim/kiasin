use migration::entities::resources::Entity;
use sea_orm::{DatabaseConnection, DbErr, EntityTrait};

pub async fn delete(id:u32,db:&DatabaseConnection)->Result<(),DbErr> {
    let _ = Entity::delete_by_id(id).exec(db).await?;
    Ok(())
}
