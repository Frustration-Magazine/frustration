import { redirect } from "next/navigation";
import { redirectIfNotSignedIn } from "@/lib/auth";

export default async function Root() {
  await redirectIfNotSignedIn();
  redirect("/income");
}
