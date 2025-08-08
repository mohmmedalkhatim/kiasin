use crate::entities::*;

#[derive(Debug, Clone, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "Database")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub data: Vec<u8>,
    pub user_id:i32,
}

impl ActiveModelBehavior for ActiveModel {}

#[derive(Debug, Clone, DeriveRelation, PartialEq, EnumIter)]
pub enum Relation {}
