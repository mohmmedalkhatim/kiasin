mod functions;
mod objects;
use objects::{Payload, Template};
use tauri::ipc::Channel;

fn templates_control(channel: Channel<Template>, payload: Payload) -> Result<(), String> {
    match payload.command.as_str() {
        "create" => {}
        "update" => {}
        "get" => {}
        "delete" => {}
        _ => {}
    };
    Ok(())
}
