"use client";

import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Eye, EyeOff, LinkIcon, Pencil, PenIcon, Trash, User } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { paperItemTypes } from "./PaperItemsPage";
import { type PaperItemWithRelations } from "../page";
import { toggleDisplayPaperItem } from "../actions/toggleDisplayPaperItem";
import { deletePaperItem } from "../actions/deletePaperItem";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PaperItemFormType } from "../models/PaperItemFormSchema";
import { PaperItemFormModal } from "./PaperItemFormModal";
import { DialogTrigger } from "@/components/ui/dialog";
import { updatePaperItem } from "../actions/updatePaperItem";

export const PaperItemCard = ({
  paperItem,
  setPaperItems,
  className,
}: {
  paperItem: PaperItemWithRelations;
  setPaperItems: React.Dispatch<React.SetStateAction<PaperItemWithRelations[]>>;
  className?: string;
}) => {
  const [displayPaperItem, setDisplayPaperItem] = useState(paperItem.displayItem);

  const paperItemType = paperItemTypes[paperItem.type];

  const handleToggleDisplay = async (checked: boolean) => {
    setDisplayPaperItem(checked);

    const { error, result: updatedPaperItem } = await toggleDisplayPaperItem(paperItem.id, checked);

    if (error || !updatedPaperItem) {
      toast.error(error);
      setDisplayPaperItem(!checked);
      return;
    }

    setPaperItems((prevPaperItems) =>
      prevPaperItems.map((pi) => (pi.id === updatedPaperItem.id ? updatedPaperItem : pi)),
    );
  };

  const handleUpdate = async (data: PaperItemFormType) => {
    const { error, result: updatedPaperItem } = await updatePaperItem(data);

    if (error || !updatedPaperItem) {
      toast.error(error);
      return;
    }

    setPaperItems((prevPaperItems) =>
      prevPaperItems.map((pi) => (pi.id === updatedPaperItem.id ? updatedPaperItem : pi)),
    );
  };

  const handleDelete = async (id: number) => {
    const { error } = await deletePaperItem(id);
    if (error) {
      toast.error(error);
      return;
    }

    setPaperItems((prevPaperItems) => prevPaperItems.filter((pi) => pi.id !== id));
  };

  const LinkButton = () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="mr-auto"
          disabled={!paperItem.link}
        >
          <a
            href={paperItem.link ?? undefined}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkIcon size={12} />
          </a>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Consulter le lien</TooltipContent>
    </Tooltip>
  );

  const DisplayPaperItemToggle = ({ displayItem }: { displayItem: boolean }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle
          pressed={displayItem}
          onPressedChange={handleToggleDisplay}
          className={cn(
            "cursor-pointer rounded-md p-2 text-white transition-colors hover:text-white data-[state=on]:text-white",
            displayItem ? "bg-green-500 hover:bg-green-500/90" : "bg-gray-400 hover:bg-gray-500",
          )}
        >
          {displayItem ? <Eye size={16} /> : <EyeOff size={16} />}
        </Toggle>
      </TooltipTrigger>
      <TooltipContent className="bg-black text-white">
        <p>{displayItem ? "Afficher l'item sur le site" : "Masquer l'item du site"}</p>
      </TooltipContent>
    </Tooltip>
  );

  const EditButton = () => (
    <PaperItemFormModal
      title="Modifier l'item papier"
      description="Cliquez sur enregistrer lorsque vous avez terminé."
      paperItem={paperItem}
      onSubmit={handleUpdate}
      trigger={
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button size="icon">
                <PenIcon size={16} />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent className="bg-black text-white">
            <p>Modifier</p>
          </TooltipContent>
        </Tooltip>
      }
    />
  );

  const DeleteButton = () => (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button
              size="icon"
              variant="destructive"
            >
              <Trash size={16} />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent className="bg-black text-white">
          <p>Supprimer</p>
        </TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer l'item papier ?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-700"
            onClick={() => handleDelete(paperItem.id)}
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <Card
      className={cn(
        className,
        "flex w-64 flex-col overflow-hidden",
        "group transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
      )}
    >
      <div className="relative overflow-hidden p-0">
        {paperItem.image ? (
          <img
            src={paperItem.image.url}
            alt={paperItem.title}
            className="h-80 w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-80 w-full bg-gray-200" />
        )}

        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <Badge variant={paperItemType.badgeVariant}>
            <paperItemType.Icon
              size={8}
              className="-ml-0.5 mr-1"
            />
            <span>{paperItemType.label}</span>
          </Badge>

          <Link href={`/paper-items?author=${paperItem.author.id}`}>
            <Badge variant="secondary">
              <User
                size={12}
                className="-ml-0.5 mr-1"
              />
              <span>{paperItem.author.name}</span>
            </Badge>
          </Link>
        </div>
      </div>

      <CardContent className="space-y-2 p-4">
        <CardTitle>{paperItem.title}</CardTitle>
        <CardDescription className="line-clamp-3 text-xs">{paperItem.description}</CardDescription>
      </CardContent>

      <CardFooter className="mt-auto gap-2 p-4 pt-0">
        <LinkButton />
        <DisplayPaperItemToggle displayItem={displayPaperItem} />
        <EditButton />
        <DeleteButton />
      </CardFooter>
    </Card>
  );
};
