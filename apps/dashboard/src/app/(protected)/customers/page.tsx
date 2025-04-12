import { signedIn } from "@/app/auth/auth";
import { redirect } from "next/navigation";
import Client from "./_client";

async function Page() {
  const isSignedIn = await signedIn();
  if (!isSignedIn) redirect("/auth/signin");
  return <Client />;
}

export default Page;
