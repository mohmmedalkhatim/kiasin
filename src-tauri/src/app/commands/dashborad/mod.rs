use serde_json::json;
use super::areas::Area;



#[tauri::command]
pub async fn dashboard() -> Area {
    println!("my frist log");
    Area {
        title: Some("dashboard".to_string()),
        ui_schema: json!({
            "item":[
                {"id":0,"cols":6,"rows":4,"type":"Areaslist","props":[1,2,3,4]},
                {"id":1,"cols":2,"rows":8,"type":"tasks","props":[1,2,3,4,5,6]},
                {"id":2,"cols":3,"rows":4,"type":"editor","props":"hello world"},
                {"id":3,"cols":3,"rows":4},
                {"id":4,"cols":8,"rows":4},
            ]
        }),
        ..Default::default()
    }
}
