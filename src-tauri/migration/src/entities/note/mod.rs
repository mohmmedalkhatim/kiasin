use crate::entities::*;



#[derive(Debug,Clone,DeriveEntityModel,Serialize,Deserialize)]
#[sea_orm(table_name = "Note")]
pub struct Model{
    #[sea_orm(primary_key)]
    pub id:i32,
    pub title:Option<String>,
    pub description:Option<String>,
    pub content:Option<String>,
    pub in_archive:bool,
    pub create_date:Date,
    pub area_id:Option<i32>,
    pub project_id:Option<i32>,
}
impl ActiveModelBehavior for ActiveModel {
     
}

impl Related<super::area::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Area.def()
    }
}

impl Related<super::resources::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Area.def()
    }
}
impl Related<super::project::Entity> for Entity {
    fn to() -> RelationDef{
        Relation::Project.def()
    }
}



#[derive(PartialEq,EnumIter,Debug,Clone,DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to="super::area::Entity",
        from = "super::note::Column::AreaId",
        to = "super::area::Column::Id"
        )]
    Area,
    #[sea_orm(
        belongs_to="super::project::Entity",
        from = "super::note::Column::ProjectId",
        to = "super::project::Column::Id"
        )]
    Project,
}