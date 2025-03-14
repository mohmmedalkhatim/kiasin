use serde_json::{Serilazed,Deserilazed};

#[derive(Clone,Debug,Serilazed,Deserilazed,)]
pub struct Component{
    pub id:String,
    pub name:String,
    pub content:String,    
}

pub struct Payload {
    pub command:Option<String>,
    pub id:Option<i32>, 
    pub item:Option<Component>,
}
