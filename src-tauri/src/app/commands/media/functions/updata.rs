use migration::entities::project::{ActiveModel, Entity};
use sea_orm::{DatabaseConnection, EntityTrait, Set};

use crate::app::commands::media::objects::*;

pub async fn updata_note(project: Media,db:&DatabaseConnection) -> Result<(), String> {
    Ok(())

}
