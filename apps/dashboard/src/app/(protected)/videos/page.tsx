import { MediaTypeContainer } from "./components/MediaTypeContainer";
import { RedeployButton } from "@/app/_components/RedeployButton";

import { redirectIfNotSignedIn } from "@/lib/auth";
import { isEnvironmentProduction } from "@/lib/utils";
import { MEDIA_TYPES_DESCRIPTION } from "./_models";

async function Page() {
  await redirectIfNotSignedIn();

  return (
    <>
      <div className="grid w-full grow grid-cols-3 gap-x-4 overflow-auto">
        {MEDIA_TYPES_DESCRIPTION.map(({ key, ...props }) => (
          <MediaTypeContainer
            key={key}
            {...props}
          />
        ))}
      </div>

      {isEnvironmentProduction && <RedeployButton refreshOptions={{ videos: true }} />}
    </>
  );
}

export default Page;
