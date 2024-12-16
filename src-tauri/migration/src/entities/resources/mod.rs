use crate::entities::*;




#[derive(Debug,DeriveEntityModel,Clone,Serialize,Deserialize)]
#[sea_orm(table_name = "Resources")]
pub struct Model{
    #[sea_orm(primary_key)]
    pub id:i32,
    pub links:Option<String>,
    
}

#[derive(Debug,Clone,DeriveRelation,EnumIter,PartialEq)]
pub enum Relation {
    
}
impl ActiveModelBehavior for ActiveModel {
    
}