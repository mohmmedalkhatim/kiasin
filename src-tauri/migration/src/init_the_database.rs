use sea_orm::Schema;
use sea_orm_migration::prelude::*;
use crate::entities::area;
use crate::entities::note;
use crate::entities::user;
use crate::entities::project;
use crate::entities::resources;
use crate::entities::db;
use crate::entities::media;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        let backend = manager.get_database_backend();
        let schema = Schema::new(backend);
        manager.create_table(schema.create_table_from_entity(area::Entity)).await?;
        manager.create_table(schema.create_table_from_entity(resources::Entity)).await?;
        manager.create_table(schema.create_table_from_entity(project::Entity)).await?;
        manager.create_table(schema.create_table_from_entity(media::Entity)).await?;
        manager.create_table(schema.create_table_from_entity(note::Entity)).await?;
        manager.create_table(schema.create_table_from_entity(db::Entity)).await?;
        manager.create_table(schema.create_table_from_entity(user::Entity)).await?;
        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        manager.drop_table(Table::drop().table(area::Entity).to_owned()).await?;
        manager.drop_table(Table::drop().table(project::Entity).to_owned()).await?;
        manager.drop_table(Table::drop().table(resources::Entity).to_owned()).await?;
        manager.drop_table(Table::drop().table(note::Entity).to_owned()).await?;
        manager.drop_table(Table::drop().table(db::Entity).to_owned()).await?;
        manager.drop_table(Table::drop().table(user::Entity).to_owned()).await?;
        Ok(())
    }
}


