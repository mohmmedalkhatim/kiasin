use migration::entities::project::{ActiveModel, Entity};
use sea_orm::{DatabaseConnection, EntityTrait, Set};

use crate::app::commands::todo::Todo;

pub async fn updata_note(project: Todo, db: &DatabaseConnection) -> Result<(), String> {
    Ok(())
}
