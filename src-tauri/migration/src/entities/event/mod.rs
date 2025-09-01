use crate::entities::*;

#[derive(Debug, Clone, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "event")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub title: Option<String>,
    pub start: Date,
    pub end: Date,
    pub created: Date,
    pub updated: Option<Date>,
    pub description: Option<Json>,
    pub location: Option<String>,
}

impl ActiveModelBehavior for ActiveModel {}

#[derive(Debug, EnumIter, PartialEq, DeriveRelation)]
pub enum Relation {}
