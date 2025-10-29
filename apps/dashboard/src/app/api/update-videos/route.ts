import { type NextRequest } from "next/server";
import { refreshMediasInDatabase } from "../../(protected)/videos/_actions";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Used in CRON job (-> vercel.json)
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  await refreshMediasInDatabase();
  if (!process.env.VERCEL_DEPLOY_HOOK)
    return new Response("Missing environment variable VERCEL_DEPLOY_HOOK", { status: 500 });

  try {
    await fetch(process.env.VERCEL_DEPLOY_HOOK, { method: "POST" });
  } catch (error) {
    return new Response("Failed to trigger redeploy hook", { status: 502 });
  }

  return new Response(`🕰️ Refreshed videos and redeploying`, { status: 200 });
}
