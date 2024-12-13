use crate::entities::*;


#[derive(Clone,Deserialize,Serialize,DeriveEntityModel,Debug)]
#[sea_orm(table_name = "User")]
pub struct Model{
    #[sea_orm(primary_key)]
    pub id:i32,
    pub name:String,
    pub email:String,
    pub password:String,
    pub icon:Option<Vec<u8>>,
    pub key:String,
}

impl ActiveModelBehavior for ActiveModel {
    
}

#[derive(EnumIter,PartialEq,Clone,Debug,DeriveRelation)]
pub enum Relation {
    
}