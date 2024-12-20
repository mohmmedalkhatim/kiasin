use migration::entities::project::{ActiveModel, Entity};
use sea_orm::{DatabaseConnection, EntityTrait, Set};

use crate::app::commands::note::objects::*;

pub async fn updata_note(project: Note, db: &DatabaseConnection) -> Result<(), String> {
    Ok(())
}
