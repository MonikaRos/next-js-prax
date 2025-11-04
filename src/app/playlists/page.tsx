import { getDb } from "@/lib/db";
import Link from "next/link";

export default async function PlaylistsPage() {
  const db = getDb();

  
  const playlists = await db
    .selectFrom("playlists")
    .innerJoin("users", "users.id", "playlists.user_id")
    .select([
      "playlists.id", 
      "playlists.name", 
      "users.name as userName",
      "users.email as userEmail"
    ])
    .where("playlists.user_id", "=", 12)
    .execute();

  return (
    <div className="font-sans min-h-screen flex flex-col items-center justify-start p-10">
      <h1 className="text-3xl font-bold mb-8">🎵 Playlists</h1>
      
      {playlists.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700">
            Showing playlists for: <strong>{playlists[0].userName}</strong>
          </p>
          <p className="text-xs text-gray-500">
            {playlists[0].userEmail}
          </p>
        </div>
      )}

      {playlists.length === 0 ? (
        <p className="text-gray-500">No playlists found.</p>
      ) : (
        <div className="w-full max-w-lg">
          <p className="text-sm text-gray-600 mb-4">
            Total: <strong>{playlists.length}</strong> playlists
          </p>
          <ul className="space-y-4">
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
        </div>
      )}
    </div>
  );
}