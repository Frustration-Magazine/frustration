import { refreshMediasInDatabase } from "../../(protected)/videos/_actions";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  await refreshMediasInDatabase();
  if (process.env.VERCEL_DEPLOY_HOOK) await fetch(process.env.VERCEL_DEPLOY_HOOK, { method: "POST" });
  return new Response(`🕰️ Refreshed videos and redeploying`);
}
