import { DB } from "@/lib/db-types";
import { faker } from "@faker-js/faker";
import type { Kysely } from "kysely";

export async function seed(db: Kysely<DB>): Promise<void> {

  console.log("🗑️  Čistím databázu...");
  await db.deleteFrom("playlists_songs").execute();
  await db.deleteFrom("playlists").execute();
  await db.deleteFrom("songs").execute();
  await db.deleteFrom("albums").execute();
  await db.deleteFrom("authors").execute();
  await db.deleteFrom("users").execute();

  console.log("👥 Vytváram používateľov...");
  const userIds: number[] = [];
  
  for (let i = 0; i < 11; i++) {
    const result = await db
      .insertInto("users")
      .values({
        email: i === 0 ? "user1@example.com" : faker.internet.email(),
        password: "password123", 
        name: i === 0 ? "First User" : faker.person.fullName(),
      })
      .returning(["id"])
      .executeTakeFirst();
    
    if (result) {
      userIds.push(result.id);
    }
  }

  console.log(`✅ Vytvorených ${userIds.length} používateľov (id: ${userIds.join(", ")})`);

  console.log("🎤 Vytváram autorov...");
  for (let i = 0; i < 20; i++) {
    const numBioParagraphs = faker.number.int({ min: 0, max: 5 });
    const bio =
      numBioParagraphs !== 0 ? faker.lorem.paragraph(numBioParagraphs) : null;

    await db
      .insertInto("authors")
      .values({
        name: faker.music.artist(),
        bio,
      })
      .execute();
  }

  const authors = await db.selectFrom("authors").selectAll().execute();
  console.log(`✅ Vytvorených ${authors.length} autorov`);

  console.log("💿 Vytváram albumy...");
  for (const author of authors) {
    const numAlbums = faker.number.int({ min: 0, max: 10 });

    for (let i = 0; i < numAlbums; i++) {
      await db
        .insertInto("albums")
        .values({
          author_id: author.id,
          name: faker.music.album(),
          release_date: faker.date.past().getTime(),
        })
        .execute();
    }
  }

  const albums = await db.selectFrom("albums").selectAll().execute();
  console.log(`✅ Vytvorených ${albums.length} albumov`);


  console.log("🎵 Vytváram pesničky...");
  for (const album of albums) {
    const typeOfAlbum = faker.number.int({ min: 0, max: 9 });
    let numSongs = 1;

    if (typeOfAlbum < 2) numSongs = 1;
    else if (typeOfAlbum < 5)
      numSongs = faker.number.int({ min: 4, max: 6 });
    else numSongs = faker.number.int({ min: 10, max: 20 });

    for (let i = 0; i < numSongs; i++) {
      await db
        .insertInto("songs")
        .values({
          album_id: album.id,
          name: faker.music.songName(),
          duration: faker.number.int({ min: 90, max: 240 }),
        })
        .execute();
    }
  }

  const songs = await db.selectFrom("songs").selectAll().execute();
  console.log(`✅ Vytvorených ${songs.length} pesničiek`);

  console.log("📝 Vytváram playlisty pre používateľov...");
  const playlistsPerUser = 10;
  let totalPlaylists = 0;

  for (const userId of userIds) {
    console.log(`   📋 Vytváram ${playlistsPerUser} playlistov pre user_id=${userId}...`);
    
    for (let i = 0; i < playlistsPerUser; i++) {
      const name = faker.word.words({ count: 2 }) + " Mix";

      const playlist = await db
        .insertInto("playlists")
        .values({ 
          name,
          user_id: userId
        })
        .returning(["id"])
        .executeTakeFirst();

      if (playlist) {
        
        const numSongsInPlaylist = faker.number.int({ min: 3, max: 8 });
        const chosenSongs = faker.helpers.arrayElements(songs, numSongsInPlaylist);

        for (const song of chosenSongs) {
          await db
            .insertInto("playlists_songs")
            .values({
              playlist_id: playlist.id,
              song_id: song.id,
            })
            .execute();
        }
        
        totalPlaylists++;
      }
    }
  }

  console.log(`✅ Vytvorených ${totalPlaylists} playlistov pre ${userIds.length} používateľov`);
  console.log("\n🎉 Seed hotový!");
  console.log(`📊 Sumár:`);
  console.log(`   - Používatelia: ${userIds.length}`);
  console.log(`   - Autori: ${authors.length}`);
  console.log(`   - Albumy: ${albums.length}`);
  console.log(`   - Pesničky: ${songs.length}`);
  console.log(`   - Playlisty: ${totalPlaylists}`);
}