import { Kysely} from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  
  await db.schema
    .createTable('playlists')
    .addColumn('id', 'integer', (col) =>
      col.primaryKey().autoIncrement().notNull()
    )
    .addColumn('name', 'text', (col) => col.notNull())
    .execute();

  
  await db.schema
    .createTable('playlists_songs')
    .addColumn('id', 'integer', (col) =>
      col.primaryKey().autoIncrement().notNull()
    )
    .addColumn('playlist_id', 'integer', (col) => col.notNull())
    .addColumn('song_id', 'integer', (col) => col.notNull())
    .addForeignKeyConstraint(
      'playlists_songs_playlist_fk',
      ['playlist_id'],
      'playlists',
      ['id'],
      (cb) => cb.onDelete('cascade')
    )
    .addForeignKeyConstraint(
      'playlists_songs_song_fk',
      ['song_id'],
      'songs',
      ['id'],
      (cb) => cb.onDelete('cascade')
    )
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('playlists_songs').execute();
  await db.schema.dropTable('playlists').execute();
}