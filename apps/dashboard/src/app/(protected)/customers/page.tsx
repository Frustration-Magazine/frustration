import { redirectIfNotSignedIn } from "@/lib/auth";
import { Client } from "./_client";

async function Page() {
  await redirectIfNotSignedIn();
  return <Client />;
}

export default Page;
