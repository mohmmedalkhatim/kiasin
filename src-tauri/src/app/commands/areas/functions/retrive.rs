use migration::{
    entities::{
        area::{Entity, Model},
        note, todo,
    },
    Expr, IntoCondition,
};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait, QueryFilter};

use crate::app::commands::areas::objects::AreaPage;

pub async fn find_one(id: i32, db: &DatabaseConnection) -> Result<Model, DbErr> {
    Ok(Entity::find_by_id(id as u32).one(db).await?.unwrap())
}

pub async fn find_many(db: &DatabaseConnection) -> Result<Vec<Model>, DbErr> {
    println!("Finding all areas");
    let list = Entity::find().all(db).await?;
    Ok(list)
}

pub async fn area_page(id: i32, db: &DatabaseConnection) -> Result<AreaPage, DbErr> {
    let info = find_one(id, db).await?;
    let notes = note::Entity::find()
        .filter(Expr::col(note::Column::AreaId).eq(id).into_condition())
        .all(db)
        .await?;
    let todos = todo::Entity::find()
        .filter(Expr::col(todo::Column::AreaId).eq(id))
        .all(db)
        .await?;

    let page = AreaPage {
        info,
        notes,
        todos,
    };
    Ok(page)
}
