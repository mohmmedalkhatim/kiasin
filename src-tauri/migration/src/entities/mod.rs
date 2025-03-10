pub mod user;
pub mod db;
pub mod note;
pub mod todo;
pub mod area;
pub mod media;
pub mod tag;
pub mod template;
use sea_orm::prelude::*;
use sea_orm_migration::prelude::*;
use serde::{Deserialize, Serialize};