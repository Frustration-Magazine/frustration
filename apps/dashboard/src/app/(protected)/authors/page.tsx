import { readRecords } from "data-access/prisma";
import CardAuthor from "./components/CardAuthor";

export const dynamic = "force-dynamic";

const { data: authors } = await readRecords({ table: "authors", where: {}, orderBy: { createdAt: "desc" }, take: 100, success: true });

async function AuthorsPage() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-4">
      {authors.map((author: any) => (
        <CardAuthor key={author.id} {...author} />
      ))}
      </div>
    </div>
  )
}

export default AuthorsPage;