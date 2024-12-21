use migration::entities::user::{ActiveModel, Entity};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait, Set};

use crate::app::commands::user::objects::User;

pub async fn create_user(user: User, db: &DatabaseConnection) -> Result<(), DbErr> {
    let mut icon_file = None;
    if let Some(icon) = user.icon {
        icon_file = Some(base64::decode(icon).unwrap());
    }

    let new = ActiveModel {
        name: Set(user.name),
        email: Set(user.email),
        password: Set(user.password),
        icon: Set(icon_file),
        ..Default::default()
    };
    let _ = Entity::insert(new).exec(db).await?;
    Ok(())
}
