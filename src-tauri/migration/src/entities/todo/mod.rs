use crate::entities::*;

#[derive(DeriveEntityModel, Serialize, Deserialize, Clone, Debug)]
#[sea_orm(table_name = "Todo")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub title:String,
    pub checked: bool,
    pub created:Date,
    pub update:Option<Date>,
    pub area_id:Option<i32>
}
impl ActiveModelBehavior for ActiveModel {}

impl Related<super::area::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Area.def()
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

}