use migration::entities::project::Entity;
use sea_orm::{DatabaseConnection, EntityTrait};




pub async  fn delete_one(db:&DatabaseConnection,id:i32)->Result<(),String> {
    Entity::delete_by_id(id).exec(db).await.expect("some thing went worrng in the delete one method");
    Ok(())
}