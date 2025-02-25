use crate::entities::*;

#[derive(DeriveEntityModel, Serialize, Deserialize, Clone, Debug)]
#[sea_orm(table_name = "Tag")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name:String,
    pub ids:Json,
}

impl ActiveModelBehavior for ActiveModel {
    
}

#[derive(DeriveRelation, EnumIter, Clone, Serialize, Deserialize, Debug)]
pub enum Relation {}
