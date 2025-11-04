import { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  
  await db.schema
    .createTable('users')
    .addColumn('id', 'integer', (col) =>
      col.primaryKey().autoIncrement().notNull()
    )
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('password', 'text', (col) => col.notNull())
    .addColumn('name', 'text')
    .execute();

  
  await db.schema
    .alterTable('playlists')
    .addColumn('user_id', 'integer', (col) => col.notNull())
    .execute();

  
  await db.schema
    .alterTable('playlists')
    .addForeignKeyConstraint(
      'playlists_user_fk',
      ['user_id'],
      'users',
      ['id'],
      (cb) => cb.onDelete('cascade')
    )
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  
  await db.schema
    .alterTable('playlists')
    .dropConstraint('playlists_user_fk')
    .execute();

  
  await db.schema
    .alterTable('playlists')
    .dropColumn('user_id')
    .execute();

  
  await db.schema.dropTable('users').execute();
}