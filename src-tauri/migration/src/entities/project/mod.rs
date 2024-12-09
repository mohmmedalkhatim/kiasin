use crate::entities::*;



#[derive(Serialize,Deserialize,DeriveEntityModel,PartialEq,Debug,Clone)]
#[sea_orm(table_name = "Project")]
pub struct Model{
    #[sea_orm(primary_key)]
    pub id:i32,
}

impl ActiveModelBehavior for ActiveModel {}

#[derive(DeriveRelation,EnumIter,Clone,Copy,Debug)]
pub enum Relation {
    
}