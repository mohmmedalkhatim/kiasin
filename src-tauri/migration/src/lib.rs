pub use sea_orm_migration::prelude::*;

mod init_the_database;

pub struct Migrator;
pub mod entities;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![Box::new(init_the_database::Migration)]
    }
}
