mod functions;
mod objects;
use objects::{Payload, Template};
use tauri::ipc::Channel;

pub fn templates_control(channel: Channel<Template>, payload: Payload) -> Result<(), String> {
    match payload.command.as_str() {
        "create" => {}
        "update" => {}
        "get" => {}
        "delete" => {}
        _ => {}
    };
    Ok(())
}
