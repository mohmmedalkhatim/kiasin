use super::areas::Area;
use serde_json::json;

#[tauri::command]
pub async fn dashboard() -> Area {
    Area {
        title: Some("Dashboard".to_string()),
        ui_schema: json!({
            "item":[
                {"id":0,"cols":3,"rows":4,"type":"Areaslist","props":{"list":[1,2,3,4]}},
                {"id":1,"cols":1,"rows":8,"type":"tasks","props":{"list":[1,2,3,4,5,6]}},
                {"id":2,"cols":1,"rows":4,"type":"editor","props":"hello world"},
                {"id":3,"cols":1,"rows":4,"type":"image","props":5},
                {"id":4,"cols":4,"rows":4,"type":"calender","props":""},
            ]
        }),
        ..Default::default()
    }
}
