use tauri::{command, ipc::Channel};
mod functions;
mod objects;
use objects::*;

#[command]
pub async fn resources_control(payload: Payload, server: Channel<Resource>) -> Result<(), String> {
    match payload.command.as_str() {
        "create" => Ok(()),
        _ => Ok(()),
    }
}
