"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/text-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageIcon, RefreshCcw, Signature, X } from "lucide-react";

import { ImagePicker } from "@/app/_components/ImagePicker";

import { PaperItemFormSchema, type PaperItemFormType } from "../models/PaperItemFormSchema";
import { type PaperItemWithRelations } from "../page";
import { Image, PaperItemType } from "@prisma/client";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { paperItemTypes } from "./PaperItemsPage";
import { useQuery } from "@tanstack/react-query";
import { getAuthors } from "@/actions/authors";

const DEFAULT_PAPER_ITEM: PaperItemFormType = {
  title: "",
  description: "",
  link: "",
  imageId: "",
  authorId: "",
  type: PaperItemType.book,
  releaseDate: new Date(),
  displayItem: true,
};

type PaperItemFormModalProps = {
  onSubmit: (data: PaperItemFormType) => Promise<void>;
  title: string;
  description: string;
  paperItem?: PaperItemWithRelations;
  trigger?: React.ReactNode;
};

export const PaperItemFormModal = ({ onSubmit, title, description, paperItem, trigger }: PaperItemFormModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState<Image | undefined>(paperItem?.image ?? undefined);

  const { data: authors } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => await getAuthors(),
  });

  const form = useForm({
    defaultValues: paperItem
      ? {
          ...paperItem,
          link: paperItem.link ?? "",
          description: paperItem.description ?? "",
          imageId: paperItem.image?.id ?? "",
          image: undefined,
          authorId: paperItem.author?.id ?? "",
          author: undefined,
        }
      : DEFAULT_PAPER_ITEM,
    validators: {
      onChange: PaperItemFormSchema,
      onSubmit: PaperItemFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await onSubmit(value);
        setIsOpen(false);
        form.reset();
        setImage(undefined);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          form.reset();
          setImage(paperItem?.image ?? undefined);
        }
      }}
    >
      {trigger ?? null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form
          className="w-2xl space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FieldSet className="max-h-[80dvh] gap-4 overflow-y-auto">
            {/* 📝 Titre */}
            <form.Field
              name="title"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>📝 Titre</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Ex: Le Manifeste du Parti Communiste"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            {/* 📚 Type et 📅 Date de sortie */}
            <FieldGroup>
              <div className="flex items-start gap-4">
                {/* 📚 Type */}
                <form.Field
                  name="type"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field
                        data-invalid={isInvalid}
                        className="basis-1/2"
                      >
                        <FieldLabel htmlFor={field.name}>📚 Type</FieldLabel>
                        <Select
                          value={field.state.value}
                          onValueChange={(value) => field.handleChange(value as PaperItemType)}
                        >
                          <SelectTrigger className="cursor-pointer">
                            <SelectValue placeholder="Sélectionner un type" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(paperItemTypes).map(([type, { label, Icon }]) => (
                              <SelectItem
                                key={type}
                                value={type}
                              >
                                <div className="flex items-center gap-2">
                                  <Icon className="size-4" />
                                  <span>{label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    );
                  }}
                />

                {/* 📅 Date de sortie */}
                <form.Field
                  name="releaseDate"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field
                        data-invalid={isInvalid}
                        className="basis-1/2"
                      >
                        <FieldLabel htmlFor={field.name}>📅 Date de sortie</FieldLabel>
                        <DatePicker
                          className="w-full"
                          value={field.state.value}
                          onChange={(newDate) => {
                            if (newDate) {
                              field.handleChange(newDate);
                            }
                          }}
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    );
                  }}
                />
              </div>
            </FieldGroup>

            {/* ✍️ Auteur */}
            <form.Field
              name="authorId"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>✍️ Auteur</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value)}
                    >
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Sélectionner un auteur" />
                      </SelectTrigger>
                      <SelectContent>
                        {authors?.map((author) => (
                          <SelectItem
                            className="flex gap-2"
                            key={author.id}
                            value={author.id}
                          >
                            <div className="flex items-center gap-2">
                              <Signature className="size-4" />
                              <span>{author.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            <FieldGroup className="gap-4">
              {/* 💬 Description */}
              <form.Field
                name="description"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>💬 Description</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        className="max-h-[7lh] resize-none"
                        placeholder="Décrivez le contenu, les thèmes abordés..."
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />

              {/* 🖼️ Image */}
              <form.Field
                name="imageId"
                children={(field) => {
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>🖼️ Image</FieldLabel>
                      {field.state.value && image?.url ? (
                        <div className="relative rounded-md bg-gray-100">
                          <img
                            src={image.url}
                            alt="Aperçu de l'item"
                            className="h-auto max-h-48 w-full rounded-md object-contain"
                          />
                          <div className="absolute right-2 top-2 space-x-2">
                            <ImagePicker
                              initialImageId={field.state.value}
                              trigger={
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <DialogTrigger asChild>
                                      <Button size="icon">
                                        <RefreshCcw />
                                      </Button>
                                    </DialogTrigger>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Remplacer l'image</p>
                                  </TooltipContent>
                                </Tooltip>
                              }
                              onSubmit={(img?: Image) => {
                                field.handleChange(img?.id ?? "");
                                setImage(img);
                              }}
                            />
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => {
                                    field.handleChange("");
                                    setImage(undefined);
                                  }}
                                >
                                  <X />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Enlever l'image</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      ) : (
                        <ImagePicker
                          initialImageId={field.state.value}
                          trigger={
                            <DialogTrigger asChild>
                              <Button>
                                <ImageIcon />
                                <span>Sélectionner une image</span>
                              </Button>
                            </DialogTrigger>
                          }
                          onSubmit={(img?: Image) => {
                            field.handleChange(img?.id ?? "");
                            setImage(img);
                          }}
                        />
                      )}
                    </Field>
                  );
                }}
              />

              {/* 🔗 Lien */}
              <form.Field
                name="link"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>🔗 Lien</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        type="url"
                        placeholder="https://www.exemple.com"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </FieldSet>

          <DialogFooter className="min-h-fit w-full flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
            {/* ✅ Afficher l'item sur le site */}
            <form.Field
              name="displayItem"
              children={(field) => (
                <Field orientation="horizontal">
                  <Switch
                    id="display-item-switch"
                    className="m-0"
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(checked === true)}
                  />
                  <FieldLabel
                    htmlFor="display-item-switch"
                    className="mb-0! text-base"
                  >
                    Afficher l'item sur le site
                  </FieldLabel>
                </Field>
              )}
            />

            <div className="flex gap-2">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  type="button"
                >
                  Annuler
                </Button>
              </DialogClose>
              <form.Subscribe
                selector={(state) => [state.isSubmitting]}
                children={([isSubmitting]) => (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                  >
                    {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                  </Button>
                )}
              />
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
