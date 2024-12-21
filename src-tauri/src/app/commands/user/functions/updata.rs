use migration::entities::user::{ActiveModel, Entity};
use sea_orm::{DatabaseConnection, EntityTrait, Set};

use super::super::objects::User;

pub async fn updata_user(user: User, db: &DatabaseConnection) -> Result<(), String> {
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
    let _ = Entity::update(new).exec(db).await;
    Ok(())
}
