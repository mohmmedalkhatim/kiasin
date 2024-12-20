use migration::entities::user::ActiveModel;
use sea_orm::Set;

use super::super::objects::User;

pub fn updata_user(user: User) -> Result<(), String> {
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
    Ok(())
}
