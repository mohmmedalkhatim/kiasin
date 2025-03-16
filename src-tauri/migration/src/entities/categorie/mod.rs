

use crate::entities::*;


#[derive(Clone, Debug, Serialize, Deserialize, DeriveEntityModel)]
#[sea_orm(table_name="categorie")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name:String,
    pub areas:Json,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}