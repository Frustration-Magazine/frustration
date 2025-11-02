"use client";

import { Loader } from "@/components/loaders/loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { MediaPreview } from "./MediaPreview";

import { YoutubeResourceType, getYoutubeResourceId } from "data-access/youtube";
import { typesTranslations } from "../_models";
import { useMedia } from "../hooks/useMedia";
import { Plus } from "lucide-react";
import { useState } from "react";

type MediaTypeContainerProps = {
  readonly type: YoutubeResourceType;
  readonly title: string;
  readonly texts: Record<string, any>;
};

export const MediaTypeContainer = ({ type, title, texts }: MediaTypeContainerProps): React.ReactNode => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    suggestions,
    loadingSuggestions,

    medias,
    loadingMedias,

    handleSearch,
    handleAddMedia,
    handleDeleteMedia,
  } = useMedia({ type });

  const Title = () => <h3 className="font-bebas text-4xl">{title}</h3>;
  const Subtitle = () => <p className="text-zinc-800">{texts?.subtitle}</p>;
  const LoaderMediaList = () => <Loader className="mx-auto my-12" />;

  const AddDialog = () => (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        {/* ➕ Ajouter */}
        <Button
          className="gap-1"
          disabled={loadingMedias}
          variant="outline"
        >
          <Plus />
          <span>Ajouter</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader className="space-y-0">
          <DialogTitle>{texts?.dialogTitle}</DialogTitle>
          <DialogDescription>{texts?.dialogDescription}</DialogDescription>
        </DialogHeader>

        {/* 🔍 Rechercher */}
        <form
          className="flex items-center space-x-2"
          onSubmit={handleSearch}
        >
          <Input
            type="text"
            placeholder={texts?.placeholder}
            name="search"
          />
          <Button type="submit">Rechercher</Button>
        </form>

        {loadingSuggestions ? (
          <Loader className="mx-auto my-12" />
        ) : (
          suggestions.map((suggestion: any) => (
            <MediaPreview
              id={getYoutubeResourceId(suggestion)}
              key={getYoutubeResourceId(suggestion)}
              title={suggestion.snippet.title}
              description={suggestion.snippet.description}
              type={type}
              thumbnail={suggestion.snippet.thumbnails.default.url}
              texts={texts}
              iconAction={handleAddMedia}
              iconType="add"
            />
          ))
        )}
      </DialogContent>
    </Dialog>
  );

  const MediaList = () =>
    medias.length === 0 ? (
      <p>🤷‍♂️ Aucune {typesTranslations.get(type)}</p>
    ) : (
      <ul className="space-y-1">
        {medias.map((media: any) => (
          <MediaPreview
            {...media}
            key={media.id}
            type={type}
            texts={texts}
            iconType="remove"
            iconAction={handleDeleteMedia}
          />
        ))}
      </ul>
    );

  /* --- 🚀 UI --- */
  return (
    <div
      key={type}
      className="scrollbar-thin scrollbar-track-white scrollbar-thumb-black max-h-full space-y-5 self-start overflow-auto rounded-md bg-white p-6 text-center shadow-md"
    >
      <div>
        <Title />
        <Subtitle />
      </div>
      <AddDialog />
      {loadingMedias ? <LoaderMediaList /> : <MediaList />}
    </div>
  );
};
