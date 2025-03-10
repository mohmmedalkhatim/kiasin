use migration::entities::todo::{self, ActiveModel, Entity};
use sea_orm::{entity::*, DatabaseConnection, DbErr, EntityTrait, QueryFilter, Set};

use crate::app::commands::todo::Todo;

pub async fn updata_note(note: Todo,id:i32, db: &DatabaseConnection) -> Result<(), DbErr> {
    let time = chrono::Local::now();
    let new = ActiveModel {
        title: Set(note.title),
        area_id: Set(note.area_id),
        update: Set(time.date_naive()),
        user_assgin_id: Set(note.user_assgin_id),
        creator_id: Set(note.creator_id),
        checked: Set(false),
        created: Set(time.date_naive()),
        ..Default::default()
    };
    let _ = Entity::update(new).filter(todo::Column::Id.eq(id)).exec(db).await?;
    Ok(())
}

