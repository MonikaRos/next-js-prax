import { getDb } from "@/lib/db";
import Link from "next/link";

export default async function PlaylistsPage() {
  const db = getDb();

  const playlists = await db
    .selectFrom("playlists")
    .select(["id", "name"])
    .execute();

  return (
    <div className="font-sans min-h-screen flex flex-col items-center justify-start p-10">
      <h1 className="text-3xl font-bold mb-8">🎵 Playlists</h1>

      {playlists.length === 0 ? (
        <p className="text-gray-500">No playlists found.</p>
      ) : (
        <ul className="space-y-4 w-full max-w-lg">
          {playlists.map((playlist) => (
            <li key={playlist.id}>
              <Link
                href={`/playlist/${playlist.id}`}
                className="block bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-4 py-3 rounded-lg shadow transition"
              >
                {playlist.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
