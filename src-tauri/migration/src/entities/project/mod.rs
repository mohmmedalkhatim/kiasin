use crate::entities::*;

#[derive(Serialize, Deserialize, DeriveEntityModel, PartialEq, Debug, Clone)]
#[sea_orm(table_name = "Project")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub title: Option<String>,
    pub area_id: Option<i32>,
    pub resource_id: Option<i32>,
    pub icon: Option<Vec<u8>>,
    pub cover: Option<Vec<u8>>,
    pub structure: Json,
    pub in_archive: bool,
    pub created:Date,
}

impl ActiveModelBehavior for ActiveModel {}
impl Related<super::area::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Area.def()
    }
}

impl Related<super::resources::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Resource.def()
    }
}
impl Related<super::note::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Notes.def()
    }
}

#[derive(DeriveRelation, EnumIter, Clone, Copy, Debug)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::area::Entity",
        from = "super::project::Column::AreaId",
        to = "super::area::Column::Id"
    )]
    Area,
    #[sea_orm(has_many = "super::note::Entity")]
    Notes,
    #[sea_orm(
        belongs_to = "super::resources::Entity",
        from = "super::project::Column::ResourceId",
        to = "super::resources::Column::Id"
    )]
    Resource,
}
