pub mod user;
pub mod area;
pub mod project;
pub mod archive;
pub mod Archive;
pub mod resources;
use sea_orm::prelude::*;
use sea_orm_migration::prelude::*;
use serde::{Deserialize, Serialize};