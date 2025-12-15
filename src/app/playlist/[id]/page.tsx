import { getDb } from "@/lib/db";
import Link from "next/link";

function formatDuration(duration: number): string {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return `${minutes}` + ":" + `${seconds}`.padStart(2, "0");
}

export default async function PlaylistPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const playlistId = parseInt(id);

  if (isNaN(playlistId)) {
    return <div>Invalid Playlist id</div>;
  }

  const db = getDb();

  const playlist = await db
    .selectFrom("playlists")
    .selectAll()
    .where("id", "=", playlistId)
    .executeTakeFirst();

  if (playlist == null) {
    return <div>Playlist not found</div>;
  }

  const songs = await db
    .selectFrom("playlists_songs")
    .innerJoin("songs", "playlists_songs.song_id", "songs.id")
    .innerJoin("albums", "songs.album_id", "albums.id")
    .innerJoin("authors", "albums.author_id", "authors.id")
    .select([
      "songs.id",
      "songs.name",
      "songs.duration",
      "songs.album_id",
      "albums.name as album_name",
      "albums.author_id",
      "authors.name as author_name",
    ])
    .where("playlists_songs.playlist_id", "=", playlist.id)
    .execute();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <p className="text-2xl font-bold">Playlist: {playlist.name}</p>
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Album</th>
                <th>Author</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song, i) => (
                <tr key={song.id}>
                  <td>{i + 1}</td>
                  <td>{song.name}</td>
                  <td>
                    <Link href={`/album/${song.album_id}`}>
                      {song.album_name}
                    </Link>
                  </td>
                  <td>
                    <Link href={`/author/${song.author_id}`}>
                      {song.author_name}
                    </Link>
                  </td>
                  <td>{formatDuration(song.duration)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
