use migration::entities::{
    area::Entity,
    db,
    template::{self, ActiveModel},
};
use sea_orm::{DatabaseConnection, DbErr, EntityTrait, Set};

use crate::app::commands::areas::Area;
