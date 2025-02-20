 interface Area {
     title: Option<String>,
     discription: Option<String>,
     ui_schema:Value,
    cover: Option<String>,
    icon: Option<String>,
}

 interface AreaPage {
     info: area::Model,
     projects: Vec<project::Model>,
     notes: Vec<note::Model>,
todos: Vec<todo::Model>,
}
 interface Payload {
     command: String,
     item: Option<Area>,
     id: Option<i32>,
}
