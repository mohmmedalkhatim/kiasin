use crate::entities::*;

#[derive(Debug, Clone, Serialize, Deserialize, DeriveEntityModel)]
#[sea_orm(table_name = "media")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub buffer:Vec<u8>,
    pub note_id:i32,
    pub project_id:i32,
    pub structure:String,
}

impl Related<super::note::Entity> for ActiveModel {
    fn to() -> RelationDef {
        Relation::Note.def()
    }
}


impl ActiveModelBehavior for ActiveModel {}
#[derive(Debug, Clone, Copy, PartialEq, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to= "super::note::Entity",
        from= "super::media::Column::NoteId",
        to= "super::note::Column::Id",
    )]
    Note,
    #[sea_orm(
        belongs_to = "super::project::Entity"
        from = "super::media::Column::ProjectId"
        to = "super::project::Column::Id"
    )]
    Project
    
}   
