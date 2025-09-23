use sea_orm::Schema;
use sea_orm_migration::prelude::*;
use crate::entities::area;
use crate::entities::note;
use crate::entities::user;
use crate::entities::db;
use crate::entities::media;
use crate::entities::todo;
use crate::entities::template;
use crate::entities::component;
use crate::entities::categorie;
use crate::entities::card;
use crate::entities::event;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        let backend = manager.get_database_backend();
        let schema = Schema::new(backend);
        manager.create_table(schema.create_table_from_entity(area::Entity)).await?;
        manager.create_table(schema.create_table_from_entity(media::Entity)).await?;
        manager.create_table(schema.create_table_from_entity(note::Entity)).await?;
        manager.create_table(schema.create_table_from_entity(db::Entity)).await?;
        manager.create_table(schema.create_table_from_entity(user::Entity)).await?;
        manager.create_table(schema.create_table_from_entity(todo::Entity)).await?;
        manager.create_table(schema.create_table_from_entity(template::Entity)).await?;
        manager.create_table(schema.create_table_from_entity(component::Entity)).await?;
        manager.create_table(schema.create_table_from_entity(categorie::Entity)).await?;
        manager.create_table(schema.create_table_from_entity(card::Entity)).await?;
        manager.create_table(schema.create_table_from_entity(event::Entity)).await?;
        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        manager.drop_table(Table::drop().table(area::Entity).to_owned()).await?;
        manager.drop_table(Table::drop().table(note::Entity).to_owned()).await?;
        manager.drop_table(Table::drop().table(media::Entity).to_owned()).await?;
        manager.drop_table(Table::drop().table(db::Entity).to_owned()).await?;
        manager.drop_table(Table::drop().table(user::Entity).to_owned()).await?;
        manager.drop_table(Table::drop().table(todo::Entity).to_owned()).await?;
        manager.drop_table(Table::drop().table(template::Entity).to_owned()).await?;
        manager.drop_table(Table::drop().table(component::Entity).to_owned()).await?;
        manager.drop_table(Table::drop().table(categorie::Entity).to_owned()).await?;
        manager.drop_table(Table::drop().table(event::Entity).to_owned()).await?;
        Ok(())
    }
}


