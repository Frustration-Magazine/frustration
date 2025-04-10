import { updatePayments } from "@/actions/update-payments";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes

export async function GET() {
  await updatePayments();
  return new Response(`🕰️  Updated payments`);
}
