
use crate::entities::*;


#[derive(Clone,Debug,Serialize,Deserialize,DeriveEntityModel)]
#[sea_orm(table_name="component")]
pub struct Model{
    #[sea_orm(primary_key)]
    pub id:i32,
    pub name:String,
    pub content:String,
}

#[derive(Debug,Clone, DeriveRelation,EnumIter)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}