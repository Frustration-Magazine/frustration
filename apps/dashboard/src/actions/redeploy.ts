"use server";

import { DEFAULT_RESPONSE_STATUS, type ResponseStatus } from "./models";
import { refreshMediasInDatabase } from "@/app/(protected)/videos/_actions";

export type RefreshOptions = {
  videos?: boolean;
};

export async function redeploy(options: RefreshOptions = {}): Promise<ResponseStatus> {
  let status = { ...DEFAULT_RESPONSE_STATUS };

  // 🔄 Refresh data based on options
  if (options.videos) {
    await refreshMediasInDatabase();
  }

  // ❌ Early return : Not redeploying in development
  if (process.env.NODE_ENV !== "production") {
    status.error = "Le redéploiement n'est pas possible en environnement de développement";
    return status;
  }

  // ❌ Early return : No deploy hook found
  if (!process.env.VERCEL_DEPLOY_HOOK) {
    status.error = "Aucun hook de déploiement trouvé parmi les variables d'environnement";
    return status;
  }

  try {
    const response = await fetch(process.env.VERCEL_DEPLOY_HOOK, {
      method: "POST",
    });
    if (response.ok) status.success = "🚀 Redéploiement du site...";
    if (!response.ok) status.error = "❌ Une erreur est survenue lors de la tentative de redéploiement";
  } catch (e) {
    status.error = `❌ Error while fetching with git hook`;
    console.error(e);
  }

  return status;
}
