use migration::entities::component::{ActiveModel, Entity};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait};

use crate::app::commands::components::objects::Component;




pub async fn update(item:Component,db:&DatabaseConnection)->Result<(),DbErr> {
    let model = ActiveModel{
        id:Set(item.id),
        name:Set(item.name),
        content:Set(item.code)
    };
    Entity::update(model).exec(db).await?;
    Ok(())
}