import { getDb } from "@/lib/db";
import Link from "next/link";

export default async function AlbumDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const numericId = Number(id);
  const db = getDb();

  const album = await db
    .selectFrom("albums")
    .select(["id", "name"])
    .where("id", "=", numericId)
    .executeTakeFirst();

  const songs = await db
    .selectFrom("songs")
    .select(["id", "name", "duration"])
    .where("album_id", "=", numericId)
    .execute();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="text-3xl font-bold mb-4">
          ALBUM DETAIL: {album?.name}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Songs:</h2>
          <table className="table-auto border-collapse border border-gray-300 w-full mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">#</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
              </tr>
            </thead>
            <tbody>
              {songs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="border border-gray-300 px-4 py-2 text-center">
                    No songs in this album.
                  </td>
                </tr>
              ) : (
                songs.map((song, idx) => (
                  <tr key={song.id}>
                    <td className="border border-gray-300 px-4 py-2">{idx + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">{song.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, '0')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Link href="/" className="btn btn-secondary mt-8">
          Späť na Home
        </Link>
      </main>
    </div>
  );
}