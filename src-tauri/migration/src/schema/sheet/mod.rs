use sea_orm::entity::prelude::*;
use sea_orm_migration::sea_orm::{self};
use serde::{Deserialize, Serialize};

#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "sheet")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: Option<String>,
    pub description: Option<String>,
    pub file: Option<Vec<u8>>,
    pub rows_info: Option<Json>,
    pub created: Option<Date>,
    pub updated: Option<Date>,
}

impl ActiveModelBehavior for ActiveModel {}
