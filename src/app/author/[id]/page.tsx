import { getDb } from "@/lib/db";
import Link from "next/link";

export default async function AuthorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const numericId = Number(id);
  const db = getDb();

  const author = await db
    .selectFrom("authors")
    .select(["id", "name", "bio"])
    .where("id", "=", numericId)
    .executeTakeFirst();

  if (!author) {
    return (
      <div className="font-sans p-8 text-center text-xl text-red-500">
        Autor neexistuje.
      </div>
    );
  }

  const albums = await db
    .selectFrom("albums")
    .select(["id", "name"])
    .where("author_id", "=", numericId)
    .execute();

  return (
    <div className="font-sans min-h-screen p-8 flex justify-center">
      <main className="max-w-2xl w-full">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">{author.name}</h1>

        <p className="mb-8 text-gray-600 leading-relaxed">
          {author.bio || "Tento autor zatiaľ nemá biografiu."}
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Albumy autora
        </h2>

        {albums.length === 0 ? (
          <p className="text-gray-500">Autor nemá žiadne albumy.</p>
        ) : (
          <ul className="space-y-2">
            {" "}
            {/*Zoznam albumov s odkazmi na detail albumu*/}
            {albums.map((album) => (
              <li key={album.id}>
                <Link
                  href={`/album/${album.id}`}
                  className="text-red-800 hover:text-gray-600 transition font-medium"
                >
                  {album.name}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <Link href="/" className="btn btn-secondary mt-8">
          Späť na Home
        </Link>
      </main>
    </div>
  );
}
