use migration::{
    entities::todo::{self, Entity, Model},
    Expr,
};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait, QueryFilter};

pub async fn find_all(db: &DatabaseConnection) -> Result<Vec<Model>, String> {
    Ok(Entity::find().all(db).await.unwrap())
}
pub async fn find_one(id: i32, db: &DatabaseConnection) -> Result<Model, DbErr> {
    Ok(Entity::find_by_id(id).one(db).await?.unwrap())
}
pub async fn find_list(ids: Vec<i32>, db: &DatabaseConnection) -> Result<Vec<Model>, DbErr> {
    let mut list = Vec::new();
    println!("{:?}", ids);
    for id in ids {
        let todo = Entity::find_by_id(id).one(db).await?.unwrap();
        list.push(todo);
    }
    Ok(list)
}
pub async fn find_for_area(
    area_id: i32,
    db: &DatabaseConnection,
) -> Result<Vec<todo::Model>, String> {
    let list = Entity::find()
        .filter(Expr::col(todo::Column::AreaId).eq(area_id))
        .all(db)
        .await;
    Ok(list.unwrap())
}
