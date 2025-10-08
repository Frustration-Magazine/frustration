import { redirectIfNotSignedIn } from "@/app/auth/auth";
import Client from "./_client";

async function Page() {
  await redirectIfNotSignedIn();
  return <Client />;
}

export default Page;
