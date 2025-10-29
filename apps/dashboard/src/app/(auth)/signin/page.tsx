import { redirectIfSignedIn } from "@/lib/auth";
import { SignInForm } from "./SignInForm";

export default async function Page() {
  await redirectIfSignedIn();

  return (
    <div className="m-auto w-[90%] max-w-[500px] shadow-lg">
      <header className="font-bebas text-yellow bg-black px-5 py-2 text-center text-3xl uppercase">
        Authentification
      </header>

      <SignInForm />
    </div>
  );
}
