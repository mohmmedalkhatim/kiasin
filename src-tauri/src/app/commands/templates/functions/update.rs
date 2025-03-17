use super::*;

pub async fn update(id: u32, db: &DatabaseConnection,item:Area) -> Result<(), DbErr> {
    let template = ActiveModel {
        title: Set(item.title),
        description: Set(item.discription),
        cover: Set(None),
        icon: Set(None),
        ui_schema: Set(item.ui_schema),
        ..Default::default()
    };
   let _ = template::Entity::update(template).exec(db).await;
    Ok(())
}
