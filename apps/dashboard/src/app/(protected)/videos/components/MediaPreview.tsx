"use client";

// 🔩 Base
import React from "react";

// 🔧 Libs
import { createYoutubeUrlFromIdAndType } from "data-access/youtube";

// 🧱 Components
import { Button } from "@/components/ui/button";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// 🗿 Models
import { type YoutubeResourceType } from "data-access/youtube";

// 🖼️ Images
import Image from "next/image";
import { AiOutlineVideoCameraAdd, AiFillDelete } from "react-icons/ai";
import { IconType } from "react-icons/lib";

function getThumbnailSizes(type: string) {
  switch (type) {
    case "channel":
      return {
        width: 66,
        height: 66,
      };
    case "playlist":
    case "video":
    default:
      return {
        width: 80,
        height: 80,
      };
  }
}

type MediaPreviewProps = {
  id: string;
  thumbnail: string;
  type: YoutubeResourceType;
  title: string;
  description: string;

  iconAction: any;
  iconType: string;

  texts: any;
};

export const MediaPreview = ({
  id,
  thumbnail,
  type,
  title,
  description,

  iconAction,
  iconType,

  texts,
}: MediaPreviewProps) => {
  let iconClass = "";
  let Icon: IconType | null = null;
  switch (iconType) {
    case "add":
      iconClass = "default";
      Icon = AiOutlineVideoCameraAdd;
      break;
    case "remove":
      iconClass = "destructive";
      Icon = AiFillDelete;
      break;
    default:
      iconClass = "default";
  }

  /* Title */
  /* ===== */
  const Title = (
    <h6 className="text-md mb-1 font-bold leading-tight hover:underline">
      <a
        href={createYoutubeUrlFromIdAndType(type, id)}
        target="_blank"
      >
        {title}
      </a>
    </h6>
  );

  /* Description */
  /* =========== */
  const Description = (
    <p
      className="overflow-hidden whitespace-break-spaces text-sm text-gray-600"
      style={{ overflowWrap: "anywhere" }}
    >
      {description}
    </p>
  );

  /* Thumbnail */
  /* ========= */
  const Thumbnail = (
    <Image
      src={thumbnail}
      alt={title}
      {...getThumbnailSizes(type)}
      className="h-full w-auto shrink-0 self-start rounded-md"
    />
  );

  const ActionDialog = (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <TooltipTrigger asChild>
          {Icon && (
            <div className="shrink-0 self-center px-3">
              <Icon
                className={`text-${iconClass}`}
                size={26}
              />
            </div>
          )}
        </TooltipTrigger>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[700px]">
        <AlertDialogHeader>
          <AlertDialogTitle>{texts?.[iconType]?.alertDialogTitle}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          {/* Force to place variant for button here, see issue here : https://github.com/shadcn-ui/ui/issues/1115 */}
          <AlertDialogAction
            asChild
            variant={iconClass as any}
            onClick={() => iconAction({ type, id })}
          >
            <Button
              type="button"
              className="flex gap-2"
            >
              {Icon && (
                <Icon
                  className="shrink-0"
                  size={16}
                />
              )}
              {texts?.[iconType].alertDialogAction}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <li
      className="box-content flex list-none space-x-3 rounded-lg p-2 text-left transition-colors hover:cursor-pointer hover:bg-gray-100"
      key={id}
      style={{ height: `${getThumbnailSizes(type).height}px` }}
    >
      {Thumbnail}
      <div className="flex grow flex-col">
        {Title}
        {Description}
      </div>
      <TooltipProvider>
        <Tooltip>
          {ActionDialog}
          <TooltipContent>
            <p>{texts?.[iconType]?.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </li>
  );
};
