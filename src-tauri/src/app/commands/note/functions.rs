mod create;
mod delete;
mod retrive;
mod update;

pub use create::{create_empty, create_note};
pub use delete::delete_one;
pub use retrive::*;
pub use update::update_note;
