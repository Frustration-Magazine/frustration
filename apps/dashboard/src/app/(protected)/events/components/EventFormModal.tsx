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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/text-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageIcon, RefreshCcw, X } from "lucide-react";

import { ImagePicker } from "@/app/_components/ImagePicker";

import { EventFormSchema, EventFormType } from "../models/EventFormSchema";
import {
  convertHourToNumber,
  convertHourToString,
  convertMinuteToNumber,
  convertMinuteToString,
  getHours,
  getMinutes,
} from "utils";
import { EventWithImage } from "../page";
import { Image } from "@prisma/client";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const hours = getHours();
const minutes = getMinutes();
const now = new Date();
now.setHours(19, 0, 0, 0);

const DEFAULT_EVENT: EventFormType = {
  date: now,
  displayHour: true,
  city: "",
  place: "",
  description: "",
  link: "",
  entrance: "",
  imageId: "",
  contact: "",
  displayContact: true,
  displayEvent: true,
};

type EventFormModalProps = {
  onSubmit: (data: EventFormType) => Promise<void>;
  title: string;
  description: string;
  event?: EventWithImage;
  trigger?: React.ReactNode;
};

export const EventFormModal = ({ onSubmit, title, description, event, trigger }: EventFormModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState<Image | undefined>(event?.image ?? undefined);

  const form = useForm({
    defaultValues: event
      ? {
          ...event,
          contact: event.contact ?? "",
          entrance: event.entrance ?? "",
          link: event.link ?? "",
          imageId: event.image?.id ?? "",
          image: undefined,
        }
      : DEFAULT_EVENT,
    validators: {
      onChange: EventFormSchema,
      onSubmit: EventFormSchema,
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
          setImage(event?.image ?? undefined);
        }
      }}
    >
      {trigger ?? null}
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          {/* 📅 Date et heure */}
          <FieldSet className="max-h-[80dvh] gap-4 overflow-y-auto">
            <FieldGroup>
              <div className="flex items-start gap-4">
                {/* 📅 Date */}
                <form.Field
                  name="date"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field
                        data-invalid={isInvalid}
                        className="basis-1/2"
                      >
                        <FieldLabel htmlFor={field.name}>📅 Date</FieldLabel>
                        <DatePicker
                          className="w-full"
                          value={field.state.value}
                          onChange={(newDate) => {
                            if (newDate) {
                              newDate.setHours(19, 0, 0, 0);
                              field.handleChange(newDate);
                            }
                          }}
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    );
                  }}
                />

                {/* 🕘 Heure et minutes */}
                <form.Field
                  name="date"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field
                        data-invalid={isInvalid}
                        className="basis-1/2"
                      >
                        <FieldLabel htmlFor="time">🕘 Heure</FieldLabel>
                        <div className="flex items-center gap-2">
                          {/* Heures */}
                          <Select
                            value={field.state.value.getHours().toString()}
                            onValueChange={(hours) => {
                              const newDate = new Date(field.state.value);
                              const hoursNumber = convertHourToNumber(hours);
                              newDate.setHours(hoursNumber);
                              field.handleChange(newDate);
                            }}
                          >
                            <SelectTrigger className="cursor-pointer">
                              <SelectValue placeholder="Heure" />
                            </SelectTrigger>
                            <SelectContent>
                              {hours.map((hour) => (
                                <SelectItem
                                  key={hour}
                                  value={convertHourToString(hour)}
                                >
                                  {convertHourToString(hour)}h
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {/* Minutes */}
                          <Select
                            value={field.state.value.getMinutes().toString().padStart(2, "0")}
                            onValueChange={(minutes) => {
                              const newDate = new Date(field.state.value);
                              const minutesNumber = convertMinuteToNumber(minutes);
                              newDate.setMinutes(minutesNumber);
                              field.handleChange(newDate);
                            }}
                          >
                            <SelectTrigger className="cursor-pointer">
                              <SelectValue placeholder="Min" />
                            </SelectTrigger>
                            <SelectContent>
                              {minutes.map((minute) => (
                                <SelectItem
                                  key={minute}
                                  value={convertMinuteToString(minute)}
                                >
                                  {convertMinuteToString(minute)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    );
                  }}
                />
              </div>
            </FieldGroup>

            {/* 📍 Ville et lieu */}
            <FieldGroup>
              <div className="flex w-full items-start gap-4">
                <form.Field
                  name="city"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field
                        data-invalid={isInvalid}
                        className="basis-1/2"
                      >
                        <FieldLabel htmlFor={field.name}>🗺️ Ville</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Ex: Paris"
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    );
                  }}
                />
                <form.Field
                  name="place"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field
                        data-invalid={isInvalid}
                        className="basis-1/2"
                      >
                        <FieldLabel htmlFor={field.name}>📍 Lieu</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Ex: Théâtre de la Ville"
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    );
                  }}
                />
              </div>
            </FieldGroup>

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
                        placeholder="Décrivez l'événement, les intervenants, le programme..."
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
                            alt="Aperçu de l'événement"
                            className="h-auto max-h-48 w-full rounded-md object-contain"
                          />
                          <div className="absolute right-2 top-2 space-x-2">
                            <ImagePicker
                              initialImageId={field.state.value}
                              trigger={
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <DialogTrigger asChild>
                                      <Button
                                        size="icon"
                                        // onClick={() => {
                                        //   field.handleChange("");
                                        //   setImage(undefined);
                                        // }}
                                      >
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

              {/* ℹ️ Mention */}
              <form.Field
                name="entrance"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>ℹ️ Mention</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Par défaut : Entrée libre"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />

              {/* 📤 Email de contact */}
              <div className="flex items-start gap-4">
                <form.Field
                  name="contact"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field
                        data-invalid={isInvalid}
                        className="basis-3/4"
                      >
                        <FieldLabel htmlFor={field.name}>📤 Email de contact</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          type="email"
                          placeholder="contact@exemple.com"
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    );
                  }}
                />

                <form.Field
                  name="displayContact"
                  children={(field) => (
                    <Field
                      orientation="horizontal"
                      className="mb-2 mt-auto basis-1/4"
                    >
                      <Checkbox
                        id="display-content-checkbox"
                        className="my-0"
                        checked={field.state.value}
                        onCheckedChange={(checked) => field.handleChange(checked === true)}
                      />
                      <FieldLabel
                        htmlFor="display-content-checkbox"
                        className="mb-0! w-fit"
                      >
                        Afficher l'email
                      </FieldLabel>
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>
          </FieldSet>

          <DialogFooter className="min-h-fit w-full flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
            {/* ✅ Afficher l'événement sur le site */}
            <form.Field
              name="displayEvent"
              children={(field) => (
                <Field orientation="horizontal">
                  <Switch
                    id="display-event-switch"
                    className="m-0"
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(checked === true)}
                  />
                  <FieldLabel
                    htmlFor="display-event-switch"
                    className="mb-0! text-base"
                  >
                    Afficher l'événement sur le site
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
