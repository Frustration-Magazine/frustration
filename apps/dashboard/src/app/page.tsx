import { signedIn } from "@/auth";
import { redirect } from "next/navigation";

async function Root() {
  const signed = await signedIn();
  if (!signed) redirect("/auth/signin");
  if (signed) redirect("/income");
}

export default Root;
