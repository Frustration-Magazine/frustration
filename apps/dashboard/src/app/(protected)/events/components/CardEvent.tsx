import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IoMailOutline as MailIcon } from "react-icons/io5";
import { GiPositionMarker as MapMarkerIcon } from "react-icons/gi";
import { Trash, PenIcon, EyeIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogClose,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { Form, FormField } from "@/components/ui/form";
import { type Event, EventFormSchema } from "../models/models";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/text-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { updateEvent } from "../actions/updateEvent";
import { deleteEvent } from "../actions/deleteEvent";
import { formatDateHour } from "utils";
import { useState } from "react";
import {
  convertHourToNumber,
  convertHourToString,
  convertMinuteToNumber,
  convertMinuteToString,
  getHours,
  getMinutes,
} from "../utils";

type EventFormType = z.infer<typeof EventFormSchema>;

function CardEvent({ event: initialEvent }: Readonly<{ event: Event }>) {
  const [isOpen, setIsOpen] = useState(false);
  const [event, setEvent] = useState<Event | null>(initialEvent);

  const form = useForm<EventFormType>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: { ...initialEvent },
  });

  async function onSubmitUpdate(data: EventFormType) {
    const result = await updateEvent(data);

    if (result.success) {
      form.reset(data);
      setIsOpen(false);
    }
  }

  async function onSubmitDelete(id: number | undefined) {
    if (!id) return;
    const { success } = await deleteEvent(id);

    if (success) {
      setEvent(null);
    }
  }

  form.watch("displayEvent");
  const { date, displayHour, city, place, description, contact, displayEvent } = form.getValues();

  if (!event) return null;

  const hours = getHours();
  const minutes = getMinutes();

  const EditButton = (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <button className="cursor-pointer rounded-md bg-black p-2 text-white">
                <PenIcon size={16} />
              </button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent className="bg-black text-white">
            <p>Modifier</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l'événement</DialogTitle>
          <DialogDescription>Cliquez sur enregistrer lorsque vous avez terminé.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className={cn("w-[650px] space-y-8")} onSubmit={form.handleSubmit(onSubmitUpdate)}>
            <div className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <div className="grow">
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
                        value={convertHourToString(field.value.getHours())}
                        onValueChange={(hours) => {
                          const newDate = new Date(field.value);
                          const hoursNumber = convertHourToNumber(hours);
                          newDate.setHours(hoursNumber);
                          field.onChange(newDate);
                        }}
                      >
                        <SelectTrigger className="cursor-pointer">
                          <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent>
                          {hours.map((hour) => (
                            <SelectItem key={hour} value={convertHourToString(hour)}>
                              {hour}h
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={convertMinuteToString(field.value.getMinutes())}
                        onValueChange={(minutes) => {
                          const newDate = new Date(field.value);
                          const minutesNumber = convertMinuteToNumber(minutes);
                          newDate.setMinutes(minutesNumber);
                          field.onChange(newDate);
                        }}
                      >
                        <SelectTrigger className="cursor-pointer">
                          <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent>
                          {minutes.map((minute) => (
                            <SelectItem key={minute} value={convertMinuteToString(minute)}>
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
            <div className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <div className="grow">
                    <Label htmlFor="city">Ville</Label>
                    <Input {...field} />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="place"
                render={({ field }) => (
                  <div className="grow">
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
                <div>
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
                  <div className="grow">
                    <Label htmlFor="contact">Email de contact</Label>
                    <Input type="email" {...field} />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="displayContact"
                render={({ field }) => (
                  <div className="mt-5 flex cursor-pointer items-center gap-1.5">
                    <Checkbox
                      id="displayContact"
                      name="displayContact"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="displayContact">Afficher publiquement l'email de contact</Label>
                  </div>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button type="submit">Enregistrer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );

  const DeleteButton = (
    <AlertDialog>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <button className="cursor-pointer rounded-md bg-red-500 p-2 text-white">
                <Trash size={16} />
              </button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent className="bg-black text-white">
            <p>Supprimer</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer l'événement ?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction className="bg-red-500 hover:bg-red-700" onClick={() => onSubmitDelete(event?.id)}>
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <Card className={cn("relative left-0 max-w-[700px] overflow-hidden bg-white", "first:after:content-none")}>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <div>
            <span className="text-lg">
              <span className="first-letter:uppercase">{formatDateHour(date, displayHour)}</span> -{" "}
              <span className="first-letter:uppercase">{city}</span>
            </span>
            <div className="flex items-center gap-0.5 font-normal text-gray-500">
              <MapMarkerIcon size={12} />
              {place}
            </div>
          </div>
          <div className="flex items-start gap-3">
            {EditButton}
            {DeleteButton}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>{description}</CardContent>
      <CardFooter className="block text-sm">
        <div className="flex w-full items-center justify-between gap-1">
          <i> Entrée libre</i>
          <div className="flex items-center gap-1">
            <MailIcon />
            <a href={`mailto:${contact}`} className="underline">
              {contact}
            </a>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1.5">
          <FormField
            control={form.control}
            name="displayEvent"
            render={({ field }) => (
              <div className={cn("flex items-center justify-center gap-2")}>
                <Switch id="displayEvent" checked={field.value} onCheckedChange={field.onChange} name="displayEvent" />
                <Label htmlFor="displayEvent" className="text-base">
                  Afficher l'événement sur le site
                </Label>
              </div>
            )}
          />
        </div>
      </CardFooter>
    </Card>
  );
}

export default CardEvent;
