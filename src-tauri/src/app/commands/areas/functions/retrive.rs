use migration::entities::area::{Column, Entity, Model};
use sea_orm::{ColumnTrait, DatabaseConnection, DbErr, EntityTrait, QueryFilter};

pub async fn find_one(id: i32, db: &DatabaseConnection) -> Result<Model, DbErr> {
    Ok(Entity::find_by_id(id as u32).one(db).await?.unwrap())
}

pub async fn find_many(db: &DatabaseConnection) -> Result<Vec<Model>, DbErr> {
    let list = Entity::find().all(db).await?;
    Ok(list)
}
pub async fn find_by_catergorie(db: &DatabaseConnection, id: i32) -> Result<Vec<Model>, DbErr> {
    let list = Entity::find()
        .filter(Column::Categorie.eq(id))
        .all(db)
        .await?;
    Ok(list)
}
