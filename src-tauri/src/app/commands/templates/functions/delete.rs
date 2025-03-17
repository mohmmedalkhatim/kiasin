
use super::*;

pub async fn delete(id: u32, db: &DatabaseConnection) -> Result<(), DbErr> {
    template::Entity::delete_by_id(id).exec(db).await?;
    Ok(())
}
