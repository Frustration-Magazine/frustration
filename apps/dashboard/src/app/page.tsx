import { signedIn } from "@/auth";
import { redirect } from "next/navigation";
const DEFAULT_HOMEPAGE = "/income";

async function Root() {
  const signed = await signedIn();
  if (!signed) redirect("/auth/signin");
  if (signed) redirect(DEFAULT_HOMEPAGE);
}

export default Root;
