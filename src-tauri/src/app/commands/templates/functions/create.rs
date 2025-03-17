use super::*;

pub async fn create(id: u32, db: &DatabaseConnection) -> Result<(), DbErr> {
    let model = Entity::find_by_id(id).one(db).await?.unwrap();
    let template = ActiveModel {
        title: Set(model.title),
        description: Set(model.descrption),
        cover: Set(model.cover),
        icon: Set(model.icon),
        created: Set(model.created),
        ui_schema: Set(model.ui_schema),
        ..Default::default()
    };
    let _ = template::Entity::insert(template).exec(db).await;
    Ok(())
}
