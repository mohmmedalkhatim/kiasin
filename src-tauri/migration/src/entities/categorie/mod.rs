

use crate::entities::*;


#[derive(Clone, Debug, Serialize, Deserialize, DeriveEntityModel)]
#[sea_orm(table_name="categorie")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name:String,
    pub areas:Json,
}
impl Related<super::area::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Area.def()
    }
    
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many="super::area::Entity",)]
    Area
}

impl ActiveModelBehavior for ActiveModel {}