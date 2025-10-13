use crate::entities::*;



#[derive(Serialize,Deserialize,PartialEq,DeriveEntityModel,Clone,Debug)]
#[sea_orm(table_name= "Area")]
pub struct Model{
    #[sea_orm(primary_key)]
    pub id:u32,
    pub user_id:u32,
    pub title:Option<String>,
    pub description:Option<String>,
    pub cover:Option<Vec<u8>>,
    pub icon:Option<Vec<u8>>,
    pub created:Option<Date>,
    pub in_archive:bool,
    pub note_id:i32,
    pub ui_schema:Json,
    pub links:Json,
}
 impl Related<super::note::Entity> for Entity {
     fn to() -> RelationDef {
         Relation::Notes.def()
     }
 }

impl ActiveModelBehavior for ActiveModel {
    
}
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::note::Entity")]
    Notes,
}