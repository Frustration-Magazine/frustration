import { updateAuthors } from "@/actions/update-authors";

export async function GET() {
    await updateAuthors();
    return new Response("Authors updated", { status: 200 });
}