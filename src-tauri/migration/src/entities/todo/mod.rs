use crate::entities::*;

#[derive(DeriveEntityModel, Serialize, Deserialize, Clone, Debug)]
#[sea_orm(table_name = "Todo")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub title:String,
    pub checked: bool,
    pub created:Date,
    pub update:Date,
    pub user_assgin_id:i32,
    pub creator_id:i32,
    pub project_id:Option<i32>,
    pub area_id:Option<i32>
}
impl ActiveModelBehavior for ActiveModel {}

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
        from = "super::todo::Column::AreaId",
        to = "super::area::Column::Id"
        )]
    Area,
    #[sea_orm(
        belongs_to="super::project::Entity",
        from = "super::todo::Column::ProjectId",
        to = "super::project::Column::Id"
        )]
    Project,
}