import VideosCard from "./components/VideosCard";
import RedeployButton from "./components/RedeployButton";
import { redirectIfNotSignedIn } from "@/app/auth/auth";
import { CardsDescription } from "./_models";

async function Page() {
  await redirectIfNotSignedIn();

  return (
    <>
      <div className="grid w-full grow grid-cols-3 gap-x-4 overflow-auto">
        {CardsDescription.map(({ key, ...props }) => (
          <VideosCard
            key={key}
            {...props}
          />
        ))}
      </div>
      <RedeployButton />
    </>
  );
}

export default Page;
