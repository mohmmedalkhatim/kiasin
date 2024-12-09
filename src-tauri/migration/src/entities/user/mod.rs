use crate::entities::*;


#[derive(Clone,Deserialize,Serialize,DeriveEntityModel,Debug)]
#[sea_orm(table_name = "User")]
pub struct Model{
    #[sea_orm(primary_key)]
    pub  id:i32,
}

impl ActiveModelBehavior for ActiveModel {
    
}

#[derive(EnumIter,PartialEq,Clone,Debug,DeriveRelation)]
pub enum Relation {
    
}