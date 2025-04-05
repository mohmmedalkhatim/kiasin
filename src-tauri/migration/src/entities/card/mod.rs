
use crate::entities::*;


#[derive(Clone,Debug,Serialize,Deserialize,DeriveEntityModel)]
#[sea_orm(table_name="card")]
pub struct Model{
    #[sea_orm(primary_key)]
    pub id:i32,
    pub cols:i32,
    pub rows:i32,
    pub name:String,
    pub props:Json
}

#[derive(Debug,Clone, DeriveRelation,EnumIter)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}