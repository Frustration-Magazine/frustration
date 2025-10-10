"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/text-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { EventFormSchema, EventFormType } from "../models/models";
import {
  convertHourToNumber,
  convertHourToString,
  convertMinuteToNumber,
  convertMinuteToString,
  getHours,
  getMinutes,
} from "utils";

const hours = getHours();
const minutes = getMinutes();
const now = new Date();
now.setHours(19, 0, 0, 0);

const DEFAULT_EVENT: EventFormType = {
  date: now,
  displayHour: true,
  description: "",
  city: "",
  place: "",
  contact: "",
  displayContact: true,
  displayEvent: true,
};

type EventFormModalProps = {
  onSubmit: (data: EventFormType) => Promise<void>;
  title: string;
  description: string;
  event?: Partial<EventFormType>;
  trigger?: React.ReactNode;
  isLoading?: boolean;
};

export const EventFormModal = ({
  onSubmit,
  title,
  description,
  event = DEFAULT_EVENT,
  trigger,
  isLoading = false,
}: EventFormModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<EventFormType>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: event,
    mode: "onChange",
  });

  const displayEvent = form.watch("displayEvent");

  const handleSubmit = async (data: EventFormType) => {
    try {
      await onSubmit(data);
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      {trigger ?? null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className={cn("w-2xl space-y-4 [&_label]:mb-2 [&_label]:block")}
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            {/* 📅 Date et heure */}
            <div className="flex items-start gap-4">
              {/* 📅 Date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className={cn("basis-1/2", !displayEvent && "opacity-50")}>
                    <FormLabel>📅 Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        className={cn("w-full", !displayEvent && "opacity-50")}
                        value={field.value}
                        onChange={(newDate) => {
                          if (newDate) {
                            newDate.setHours(19, 0, 0, 0);
                            field.onChange(newDate);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 🕘 Heure */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="basis-1/2">
                    <FormLabel>🕘 Heure</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        {/* Heures */}
                        <Select
                          value={field.value.getHours().toString()}
                          onValueChange={(hours) => {
                            const newDate = new Date(field.value);
                            const hoursNumber = convertHourToNumber(hours);
                            newDate.setHours(hoursNumber);
                            field.onChange(newDate);
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
                          value={field.value.getMinutes().toString().padStart(2, "0")}
                          onValueChange={(minutes) => {
                            const newDate = new Date(field.value);
                            const minutesNumber = convertMinuteToNumber(minutes);
                            newDate.setMinutes(minutesNumber);
                            field.onChange(newDate);
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 📍 Ville et lieu */}
            <div className="flex w-full items-start gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className={cn("basis-1/2", !displayEvent && "opacity-50")}>
                    <FormLabel>📍 Ville</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ex: Paris"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="place"
                render={({ field }) => (
                  <FormItem className={cn("basis-1/2", !displayEvent && "opacity-50")}>
                    <FormLabel>📍 Lieu</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ex: Théâtre de la Ville"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 💬 Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className={cn(!displayEvent && "opacity-50")}>
                  <FormLabel>💬 Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="max-h-[7lh] resize-none"
                      placeholder="Décrivez l'événement, les intervenants, le programme..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 📤 Email de contact */}
            <div className="flex items-start gap-4">
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem className={cn("grow", !displayEvent && "opacity-50")}>
                    <FormLabel>📤 Email de contact</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        placeholder="contact@exemple.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="displayContact"
                render={({ field }) => (
                  <FormItem className={cn("mt-8.5 flex items-center gap-2", !displayEvent && "opacity-50")}>
                    <FormControl>
                      <Checkbox
                        className="my-0"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="mb-0!">Afficher l'email</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
              {/* ✅ Afficher l'événement sur le site */}
              <FormField
                control={form.control}
                name="displayEvent"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch
                        className="m-0"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="mb-0! text-base">Afficher l'événement sur le site</FormLabel>
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    type="button"
                    disabled={isLoading}
                  >
                    Annuler
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={!form.formState.isValid || isLoading}
                >
                  {isLoading ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
