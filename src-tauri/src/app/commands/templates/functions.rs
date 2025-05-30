use migration::entities::{
    area::Entity,
    template::{self, ActiveModel},
};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait, Set};

use crate::app::commands::areas::Area;

mod create;
mod delete;
mod retrive;
mod update;
