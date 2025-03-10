use crate::entities::*;

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, DeriveEntityModel)]
#[sea_orm(table_name = "template")]
pub struct Model {
    #[sea_orm(primary_key)]
    id: u32,
    title: Option<String>,
    description: Option<String>,
    cover: Option<Vec<u8>>,
    icon: Option<Vec<u8>>,
    created: Option<Date>,
    ui_schema: Json,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
