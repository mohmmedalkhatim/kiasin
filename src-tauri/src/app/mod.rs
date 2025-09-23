pub mod commands;
pub mod util;
pub use commands::{
    areas::{__cmd__areas_control, areas_control},
    dashboard::{__cmd__dashboard, dashboard},
    database::{__cmd__database_control, database_control},
    events::{__cmd__events_control, events_control},
    media::{__cmd__media_control, media_control},
    note::{__cmd__notes_control, notes_control},
    todo::{__cmd__todos_control, todos_control},
    user::{__cmd__user_control, user_control},
    windows::{__cmd__window_control, window_control},
};
pub use util::database_connection;
