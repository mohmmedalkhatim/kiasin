use migration::entities::user::{ActiveModel, Entity};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait, Set};

use crate::app::commands::user::objects::User;

pub async fn create_user(user: User, db: &DatabaseConnection) -> Result<i32, DbErr> {
    let mut icon_file = None;
    if let Some(icon) = user.icon {
        icon_file = Some(base64::decode(icon).unwrap());
    }
    println!("create user");
    let new = ActiveModel {
        name: Set(user.name),
        email: Set(user.email),
        password: Set(user.password),
        icon: Set(icon_file),
        key: Set("hello".to_string()),
        ..Default::default()
    };
    let res = Entity::insert(new).exec(db).await?;
    Ok(res.last_insert_id)
}
