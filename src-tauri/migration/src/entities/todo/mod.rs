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

#[derive(DeriveRelation, Clone, Debug, EnumIter)]
pub enum Relation {}
