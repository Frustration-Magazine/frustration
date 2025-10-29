import { redirectIfNotSignedIn } from "@/lib/auth";

export default async function Page() {
  await redirectIfNotSignedIn();

  return (
    <>
      <p className="text-center text-2xl font-bold">🚧 En travaux...</p>
    </>
  );
}
