use migration::entities::note::{self, Column, Entity, Model};
use sea_orm::{entity::*, DatabaseConnection, DbErr, EntityTrait, QueryFilter, QueryOrder};

pub async fn find_many(db: &DatabaseConnection) -> Result<Vec<Model>, DbErr> {
    Ok(Entity::find().all(db).await?)
}
pub async fn find_one(id: i32, db: &DatabaseConnection) -> Result<Model, DbErr> {
    let item = Entity::find_by_id(id).one(db).await?;
    Ok(item.unwrap())
}

pub async fn find_list(
    ids: Vec<i32>,
    db: &DatabaseConnection,
) -> Result<Vec<note::Model>, DbErr> {
    let mut list = Vec::new();
    for id in ids.iter()  {
        list.push(Entity::find_by_id(*id).one(db).await.unwrap().unwrap());
    }
    Ok(list)
}
pub async fn recent_for_area(
    area_id: i32,
    db: &DatabaseConnection,
) -> Result<Vec<note::Model>, DbErr> {
    let list = Entity::find()
        .filter(note::Column::AreaId.eq(area_id))
        .order_by(note::Column::CreateDate, sea_orm::Order::Asc)
        .all(db)
        .await?;
    Ok(list)
}
