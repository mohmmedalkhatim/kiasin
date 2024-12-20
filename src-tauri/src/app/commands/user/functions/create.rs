use migration::entities::user::{ActiveModel, Entity, Model};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait, Set};

use crate::app::commands::user::objects::User;

pub async fn create_user(user: User, db: &DatabaseConnection) -> Result<(), DbErr> {
    let mut icon = None;
    if user.icon.is_some() {
        let file = base64::decode(user.icon.clone().unwrap()).unwrap();
        icon = Some(file)
    }

    let new = ActiveModel {
        name: Set(user.name),
        email: Set(user.email),
        password: Set(user.password),
        icon: Set(icon),
        ..Default::default()
    };
    let model = Entity::insert(new).exec(db).await?;
    Ok(())
}
