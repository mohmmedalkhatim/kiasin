use migration::entities::area::ActiveModel;
use sea_orm::Set;

use crate::app::commands::archive::objects::*;


fn create_area(area:Area)->Result<(),String>{
    let new = ActiveModel{
        title:Set(area.title),
        user_id: Set(1),
        descrption: Set(area.discription),
        icon: todo!(), 
        ..Default::default()
    };
    Ok(())
}