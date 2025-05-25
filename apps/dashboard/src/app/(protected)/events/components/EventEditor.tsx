"use client";

import React, { useState } from "react";
import CardEvent from "./CardEvent";

import { z } from "zod";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { DatePicker } from "@/components/ui/date-picker";

import { type Event, EventFormSchema } from "../models/models";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { createEvent } from "../actions/createEvent";
import { Plus } from "lucide-react";
import { Dialog, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogContent } from "@/components/ui/dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/text-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getHours, getMinutes } from "../utils";

const hours = getHours();
const minutes = getMinutes();

const now = new Date();
now.setHours(19, 0, 0, 0);

const DEFAULT_EVENT = {
  date: now,
  displayHour: true,
  description: "",
  city: "",
  place: "",
  contact: "",
  displayContact: true,
  displayEvent: true,
};

type EventFormType = z.infer<typeof EventFormSchema>;

function EventEditor({ events: initialEvents }: Readonly<{ events: ReadonlyArray<Event> }>) {
  const [events, setEvents] = useState<ReadonlyArray<Event>>(initialEvents);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<EventFormType>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: { ...DEFAULT_EVENT },
  });

  async function onSubmit(data: EventFormType) {
    const { success, result } = await createEvent(data);

    if (success && result) {
      setEvents((prevEvents) => {
        const newEvents = [...prevEvents, result].sort((a, b) => a.date.getTime() - b.date.getTime());
        return newEvents;
      });
      form.reset(data);
      setIsOpen(false);
    }
  }

  form.watch();
  const { displayEvent } = form.getValues();

  const AddButton = (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="sticky top-0 flex cursor-pointer flex-wrap items-center gap-2 opacity-50 transition-opacity hover:opacity-100">
          <div className="flex w-full justify-center">
            <Button className="bg-black hover:bg-black">
              <span className="text-yellow">Ajouter un événement</span>
            </Button>
          </div>
          <hr className="grow border-2 border-black" />
          <button className="text-yellow cursor-pointer rounded-full bg-black p-2">
            <Plus size={26} />
          </button>
          <hr className="grow border-2 border-black" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un événement</DialogTitle>
          <DialogDescription>Cliquez sur enregistrer lorsque vous avez terminé.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className={cn("w-[650px] space-y-8")} onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="displayEvent"
              render={({ field }) => (
                <div className={cn("mx-auto mt-2 mb-8 flex items-center justify-center gap-2")}>
                  <Switch
                    id="displayEvent"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    name="displayEvent"
                  />
                  <Label htmlFor="displayEvent" className="text-base">
                    Afficher l'événement sur le site
                  </Label>
                </div>
              )}
            />
            <div className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <div className={cn("grow", !displayEvent && "opacity-50")}>
                    <Label htmlFor="date">Date</Label>
                    <DatePicker value={field.value} onChange={field.onChange} className="flex w-full" name="date" />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <div className="grow">
                    <Label htmlFor="hour">Heure</Label>
                    <div className="flex items-center gap-2">
                      <Select
                        value={field.value.getHours().toString()}
                        onValueChange={(hours) => {
                          const newDate = new Date(field.value);
                          const hoursNumber = Number(hours.replace(/[^0-9]/g, ""));
                          newDate.setHours(hoursNumber);
                          field.onChange(newDate);
                        }}
                      >
                        <SelectTrigger className="cursor-pointer">
                          <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent>
                          {hours.map((hour) => (
                            <SelectItem key={hour} value={hour.toString()}>
                              {hour}h
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={field.value.getMinutes().toString().padStart(2, "0")}
                        onValueChange={(minutes) => {
                          const newDate = new Date(field.value);
                          const minutesNumber = Number(minutes.replace(/[^0-9]/g, ""));
                          newDate.setMinutes(minutesNumber);
                          field.onChange(newDate);
                        }}
                      >
                        <SelectTrigger className="cursor-pointer">
                          <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent>
                          {minutes.map((minute) => (
                            <SelectItem key={minute} value={minute.toString()}>
                              {minute}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              />
            </div>
            <div className="flex w-full items-center gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <div className={cn("grow", !displayEvent && "opacity-50")}>
                    <Label htmlFor="city">Ville</Label>
                    <Input {...field} />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="place"
                render={({ field }) => (
                  <div className={cn("grow", !displayEvent && "opacity-50")}>
                    <Label htmlFor="place">Lieu</Label>
                    <Input {...field} />
                  </div>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <div className={cn(!displayEvent && "opacity-50")}>
                  <Label htmlFor="description">Description</Label>
                  <Textarea {...field} className="max-h-[7lh]" />
                </div>
              )}
            />
            <div className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <div className={cn("grow", !displayEvent && "opacity-50")}>
                    <Label htmlFor="contact">Email de contact</Label>
                    <Input type="email" {...field} />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="displayContact"
                render={({ field }) => (
                  <div className={cn("mt-5 flex cursor-pointer items-center gap-1.5", !displayEvent && "opacity-50")}>
                    <Checkbox
                      id="displayContact"
                      name="displayContact"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="displayContact">Afficher l'email de contact</Label>
                  </div>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button type="submit" disabled={!form.formState.isValid}>
                Enregistrer
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="flex h-full w-full flex-col overflow-auto">
      {AddButton}
      <div className="scrollbar-none mx-auto space-y-6 overflow-auto mask-t-from-95% mask-b-from-95% py-12">
        {events.map((event) => (
          <CardEvent key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

export default EventEditor;
