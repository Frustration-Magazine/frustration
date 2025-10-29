"use server";

import { prisma } from "data-access/prisma";
import { type Image } from "@prisma/client";
import { DEFAULT_RESPONSE_STATUS, type ResponseStatus } from "./_models";

import { UTApi } from "uploadthing/server";
import { requireSession } from "@/lib/auth";
const utapi = new UTApi();

/* --- UploadThing --- */

/**
 * Delete a file from UploadThing using its file key
 */
async function deleteFileFromUploadThing(fileKey: string): Promise<ResponseStatus> {
  let status: ResponseStatus = DEFAULT_RESPONSE_STATUS;

  try {
    await utapi.deleteFiles(fileKey);
    status.success = "Le fichier a été supprimé avec succès!";
  } catch (error) {
    console.error("Erreur lors de la suppression du fichier de UploadThing:", error);
    const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue s'est produite";
    status.error = `Échec de la suppression du fichier: ${errorMessage}`;
  }

  return status;
}

/**
 * Extract the file key from an UploadThing URL
 * Example: https://utfs.io/f/abc123.png -> abc123.png
 */
function extractFileKeyFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    return pathParts[pathParts.length - 1] || null;
  } catch {
    return null;
  }
}

/* --- Server actions --- */

export async function getImages(): Promise<Image[]> {
  await requireSession();
  try {
    const images = await prisma.image.findMany();
    return images;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des images:", error);
    throw new Error("❌ Une erreur est survenue lors de la récupération des images.");
  }
}

// Only creates image in DB, not in UploadThing
// Upload is handled by the UploadButton component
export async function createImage(url: string, name?: string): Promise<ResponseStatus & { result?: Image }> {
  await requireSession();
  let response = { ...DEFAULT_RESPONSE_STATUS };

  try {
    const newImage = await prisma.image.create({
      data: {
        url,
        name,
      },
    });

    return { ...response, success: "L'image a été créée avec succès!", result: newImage };
  } catch (error) {
    response.error = "Une erreur est survenue lors de la création de l'image.";
    console.error(response.error, error);
    return response;
  }
}

export async function deleteImage(id: string): Promise<ResponseStatus> {
  await requireSession();
  let response = { ...DEFAULT_RESPONSE_STATUS };

  try {
    // Vérifier que l'image existe
    const image = await prisma.image.findUnique({ where: { id } });
    if (!image?.url) {
      return { ...response, error: "L'image n'a pas été trouvée" };
    }

    // Vérifier que l'image n'est pas utilisée par un événement
    const event = await prisma.events.findFirst({ where: { imageId: id } });
    if (event) {
      return { ...response, error: "L'image est utilisée par un événement" };
    }

    // Vérifier que l'image n'est pas utilisée par un auteur
    const author = await prisma.author.findFirst({ where: { imageId: id } });
    if (author) {
      return { ...response, error: "L'image est utilisée par un auteur" };
    }

    // Vérifier que l'image n'est pas utilisée par une sortie papier
    const paperItem = await prisma.paperItem.findFirst({ where: { imageId: id } });
    if (paperItem) {
      return { ...response, error: "L'image est utilisée par une sortie papier" };
    }

    // Supprimer le fichier de UploadThing
    const fileKey = extractFileKeyFromUrl(image.url);
    if (fileKey) {
      const uploadThingResult = await deleteFileFromUploadThing(fileKey);
      if (uploadThingResult.error) {
        console.error("Erreur lors de la suppression du fichier UploadThing:", uploadThingResult.error);
      }
    }

    // Supprimer l'entrée en base de données
    await prisma.image.delete({ where: { id } });
    return { ...response, success: "L'image a été supprimée avec succès!" };
  } catch (error) {
    console.error("Erreur lors de la suppression de l'image:", error);
    return { ...response, error: "Une erreur est survenue lors de la suppression de l'image." };
  }
}
