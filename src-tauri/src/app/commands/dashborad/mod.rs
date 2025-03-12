use serde_json::json;
use tauri::Runtime;

use super::areas::Area;

#[tauri::command]
pub async fn dashboard() -> Area {
    println!("my frist log");
    Area {
        title: Some("dashboard".to_string()),
        ui_schema: json!({
            "item":[
                {"id":0,"cols":6,"rows":4},
                {"id":1,"cols":2,"rows":6},
                {"id":2,"cols":3,"rows":4},
                {"id":3,"cols":3,"rows":4},
                {"id":4,"cols":8,"rows":4},
            ]
        }),
        ..Default::default()
    }
}
