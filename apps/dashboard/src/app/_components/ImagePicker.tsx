"use client";

import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import NextImage from "next/image";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CircleCheck, Trash } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";

import { createImage, deleteImage, getImages } from "@/actions/images";
import type { Image } from "@prisma/client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

type ImagePickerProps = {
  initialImageId?: string;
  trigger?: React.ReactNode;
  onSubmit?: (img?: Image) => void;
};

export const ImagePicker = ({ initialImageId, trigger, onSubmit }: ImagePickerProps) => {
  const [selectedImageId, setSelectedImageId] = useState<string | undefined>(initialImageId);

  const { data: images, refetch: refetchImages } = useQuery({
    queryKey: ["images"],
    queryFn: async () => await getImages(),
  });

  const handleSelectImage = (id: string) => {
    if (selectedImageId === id) {
      setSelectedImageId?.(undefined);
    } else {
      setSelectedImageId?.(id);
    }
  };

  return (
    <Dialog>
      {trigger ?? null}
      <DialogContent className="w-fit sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center">🖼️ Bibliothèque d'images</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Sélectionnez une image depuis la bibliothèque d'images ou uploadez une nouvelle image.
        </DialogDescription>

        <div className="mx-auto grid max-h-[50vh] grid-cols-3 overflow-y-auto border">
          {images?.map((image) => (
            <div
              className="relative col-span-1 border"
              key={image.id}
            >
              <NextImage
                src={image.url}
                alt={image.name || "Image"}
                className={cn(
                  "size-48 cursor-pointer object-contain hover:opacity-80",
                  selectedImageId === image.id && "opacity-80 hover:opacity-70",
                )}
                onClick={() => handleSelectImage(image.id)}
                width={192}
                height={192}
              />
              <p className="mx-auto my-1 w-[12ch] truncate text-sm">{image.name}</p>
              {selectedImageId === image.id && (
                <CircleCheck
                  className={cn(
                    "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer drop-shadow-md",
                    "text-green-500 transition-colors duration-100 hover:opacity-80",
                  )}
                  size={48}
                  strokeWidth={2}
                  onClick={() => handleSelectImage(image.id)}
                />
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="absolute bottom-2 right-2"
                    variant="destructive"
                    size="icon"
                  >
                    <Trash size={16} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer l'image</AlertDialogTitle>
                    <AlertDialogDescription>Êtes-vous sûr de vouloir supprimer cette image ?</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                      <Button variant="outline">Annuler</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button
                        variant="destructive"
                        onClick={async () => {
                          const { success, error } = await deleteImage(image.id);
                          if (success) {
                            refetchImages();
                            toast.success(success);
                          } else {
                            toast.error(error);
                          }
                        }}
                      >
                        Supprimer
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>

        <UploadButton
          content={{
            button({ ready, isUploading }) {
              if (ready) {
                return <div>⬆️ Uploader</div>;
              }
              if (isUploading) {
                return <div>⏳ Upload en cours...</div>;
              }

              return <div>⏳ Chargement...</div>;
            },
          }}
          endpoint="image"
          onClientUploadComplete={async (res) => {
            if (res && res[0]) {
              const { result: newImage, success, error } = await createImage(res[0].ufsUrl, res[0].name);
              if (success && newImage) {
                refetchImages();
                setSelectedImageId(newImage.id);
                toast.success(success);
              } else {
                toast.error(error);
              }
            }
          }}
          onUploadError={() => {
            toast.error("Une erreur est survenue lors de l'upload de l'image !");
          }}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              disabled={!selectedImageId}
              onClick={() => onSubmit?.(images?.find((img) => img.id === selectedImageId))}
            >
              Valider
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
