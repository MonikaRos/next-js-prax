import { getDb } from "@/lib/db";
import Link from "next/link";

export default async function PlaylistDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const numericId = Number(id);
  const db = getDb();


  const playlist = await db
    .selectFrom("playlists")
    .innerJoin("users", "users.id", "playlists.user_id")
    .select([
      "playlists.id", 
      "playlists.name",
      "users.name as userName",
      "users.email as userEmail"
    ])
    .where("playlists.id", "=", numericId)
    .executeTakeFirst();

  if (!playlist) {
    return <div className="p-10 text-center text-red-600">Playlist not found</div>;
  }


  const songs = await db
    .selectFrom("playlists_songs")
    .innerJoin("songs", "songs.id", "playlists_songs.song_id")
    .innerJoin("albums", "albums.id", "songs.album_id")
    .innerJoin("authors", "authors.id", "albums.author_id")
    .select([
      "songs.id as id",
      "songs.name as name",
      "songs.duration as duration",
      "authors.id as authorId",
      "authors.name as authorName",
    ])
    .where("playlists_songs.playlist_id", "=", numericId)
    .execute();

  return (
    <div className="font-sans min-h-screen flex flex-col items-center justify-start p-10">
      <h1 className="text-3xl font-bold mb-4">🎧 {playlist.name}</h1>
      
      <div className="mb-8 text-center">
        <p className="text-sm text-gray-600">
          Created by: <strong>{playlist.userName}</strong>
        </p>
        <p className="text-xs text-gray-500">{playlist.userEmail}</p>
      </div>

      {songs.length === 0 ? (
        <p className="text-gray-500">No songs in this playlist.</p>
      ) : (
        <table className="table-auto border-collapse border border-gray-300 w-full max-w-3xl text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2">#</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Author</th>
              <th className="border border-gray-300 px-4 py-2">Duration</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song, idx) => (
              <tr key={song.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{idx + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{song.name}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <Link
                    href={`/author/${song.authorId}`}
                    className="text-blue-600 hover:underline"
                  >
                    {song.authorName}
                  </Link>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {Math.floor(song.duration / 60)}:
                  {String(song.duration % 60).padStart(2, "0")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link
        href="/playlists"
        className="mt-10 inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-5 py-2 rounded-lg shadow transition"
      >
        ← Back to playlists
      </Link>
    </div>
  );
}