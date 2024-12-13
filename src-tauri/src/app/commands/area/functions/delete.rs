use migration::entities::area::{ActiveModel, Entity, Model};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait, Set};

use super::find_one;

pub async fn delete_area(id:i32, db: &DatabaseConnection) -> Result<(), DbErr> {
    let model = find_one(id, db).await?;
    let active = ActiveModel{
        id: Set(model.id),
        user_id: Set(model.user_id),
        title: Set(model.title),
        descrption: Set(model.descrption),
        cover: Set(model.cover),
        icon: Set(model.icon),
        ..Default::default()
    };
    let  _ = Entity::delete(active).exec(db).await?;
    Ok(())
}
