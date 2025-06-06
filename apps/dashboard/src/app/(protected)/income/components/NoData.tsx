import React from "react";

export default function () {
  return (
    <div className="mx-auto grid h-full w-[50%] max-w-[700px] place-items-center text-center text-2xl font-bold">
      <p className="rounded-sm bg-black/5 px-5 py-3 text-gray-700 backdrop-blur">
        Aucune donnée disponible à afficher... 😔 <br />
        <small className="text-sm">
          <span className="mr-1 text-xs">💡</span>
          <span>
            Essayez de vous connecter sur le base de production plutôt ? <br />
            <code>pnpm run dev:prod</code>
          </span>
        </small>
      </p>
    </div>
  );
}
