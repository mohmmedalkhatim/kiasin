use migration::entities::project::ActiveModel;
use sea_orm::Set;

use crate::app::commands::project::objects::*;


fn create_area(project:Project)->Result<(),String>{
    let icon = base64::decode(project.icon.clone().unwrap()).expect("there is a problem with the image format");
    let cover = base64::decode(project.cover.clone().unwrap()).expect("there is a problem with the image format");
    let new = ActiveModel{
        title:Set(project.title),
        area_id: Set(Some(1)),
        icon: todo!(), 
        ..Default::default()
    };
    Ok(())
}