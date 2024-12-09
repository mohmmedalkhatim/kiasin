use crate::entities::*;



#[derive(Debug,Clone,Serialize,Deserialize,DeriveEntityModel)]
#[sea_orm(table_name = "Archive")]
pub struct Model{
    #[sea_orm(primary_key)]
    pub id:i32,

}

impl ActiveModelBehavior for ActiveModel {
    
}
#[derive(Debug,DeriveRelation,EnumIter,Clone, Copy)]
pub enum Relation {
    
}