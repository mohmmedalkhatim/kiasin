use crate::entities::*;



#[derive(Serialize,Deserialize,PartialEq,DeriveEntityModel,Clone,Debug)]
#[sea_orm(table_name= "Resource")]
pub struct Model{
    #[sea_orm(primary_key)]
    pub id:i32,
    pub user_id:i32,
    pub title:Option<String>,
    pub descrption:Option<String>,
    pub cover:Option<Vec<u8>>,
    pub icon:Option<Vec<u8>>,
    pub in_archive:bool

}
 impl Related<super::note::Entity> for Entity {
     fn to() -> RelationDef {
         Relation::Notes.def()
     }
 }
 impl Related<super::project::Entity> for Entity {
     fn to() -> RelationDef {
         Relation::Project.def()
     }
 }

impl ActiveModelBehavior for ActiveModel {
    
}
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::note::Entity")]
    Notes,
    #[sea_orm(has_many = "super::project::Entity")]
    Project
}