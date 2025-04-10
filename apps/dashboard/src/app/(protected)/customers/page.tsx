import { signedIn } from "@/app/auth/auth";
import Client from "./_client";
import { redirect } from "next/navigation";

async function Page() {
  const isSignedIn = await signedIn();
  if (!isSignedIn) redirect("/auth/signin");
  return <Client />;
}

export default Page;
