import { type NextRequest } from "next/server";
import { updatePayments } from "@/actions/update-payments";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes

// Used in CRON job (-> vercel.json)
export async function GET(request: NextRequest) {
  // const authHeader = request.headers.get("authorization");
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new Response("Unauthorized", { status: 401 });
  // }

  try {
    await updatePayments();
  } catch {
    return new Response("Failed to update payments", { status: 500 });
  }

  return new Response(`🕰️ Updated payments`, { status: 200 });
}
