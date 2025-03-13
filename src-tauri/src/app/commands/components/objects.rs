use serde_json::{Serilazed,Deserilazed};

#[derive(Clone,Debug,Serilazed,Deserilazed,)]
pub struct Component{
    id:String,
    name:String,
    code:String,    
}

pub struct Payload {
    command:String,
    id:Option<i32>, 
    item:Component,
}
