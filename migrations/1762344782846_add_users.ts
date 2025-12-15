import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await sql`CREATE TABLE users (
		id integer primary key autoincrement not null,
		email text not null,
		password text not null,
		name text
	) STRICT`.execute(db);

  await sql`ALTER TABLE playlists ADD COLUMN user_id integer not null references users (id)`.execute(
    db
  );
}
