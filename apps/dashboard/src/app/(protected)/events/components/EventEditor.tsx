"use client";

import React from "react";
import {
  Card,
  CardContent,
  // CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CardEvent from "./CardEvent";

import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
// import { Input } from "@/components/Input";

// 🗒️ Form
// import { updateDashboard } from "../_actions";
// import { FormUpdateSchema } from "../_models";
import { toFormData } from "utils";
import { zodResolver } from "@hookform/resolvers/zod";

// 🪝 Hooks
import { useForm } from "react-hook-form";
import { useFormToast } from "@/hooks/useFormToast";
import { useFormLoader } from "@/hooks/useFormLoader";
import { useFormAction } from "@/hooks/useFormAction";

import { type Event, EventFormSchema } from "../models/models";
import { updateEvent } from "../actions/updateEvent";

const now = new Date();

function EventEditor({ events }: Readonly<{ events: ReadonlyArray<Event> }>) {
  const [formState, formAction] = useFormAction(updateEvent, true);
  const [loading, setLoading] = useFormLoader(formState);
  useFormToast(formState);

  type EventFormType = z.infer<typeof EventFormSchema>;
  const form = useForm<EventFormType>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: {
      date: now,
      displayHour: true,
      description: "",
      city: "",
      place: "",
      contact: "",
      displayContact: false,
      displayEvent: true,
    },
  });

  const submit = (data: EventFormType) => {
    const formData = toFormData(data);
    // formAction(formData);
    // setLoading(true);
  };

  const EventForm = (
    <Form {...form}>
      <form className="flex flex-col items-center gap-5" onSubmit={form.handleSubmit(submit)}>
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <div className="flex items-center gap-3">
              <FormItem className="space-y-0">
                <DatePicker />
              </FormItem>
            </div>
          )}
        />
        <Button
          // disabled={loading}
          className="font-bold"
          variant="default"
          type="submit"
        >
          {/* {loading ? (
            <TfiReload className="mr-2 animate-spin direction-reverse" />
          ) : null} */}
          <span>Mettre à jour l'événement</span>
        </Button>
      </form>
    </Form>
  );

  return (
    <div className="grid h-full w-full grid-cols-[600px_auto] gap-8">
      <Card className="min-w-[300px] overflow-scroll border-none bg-black/90 text-white shadow-lg backdrop-blur-md">
        <CardHeader className="text-3xl font-semibold">
          <CardTitle>Gestionnaire d'événements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 px-4">{EventForm}</CardContent>
      </Card>

      <div className="space-y-6 overflow-auto">
        {events.map((event) => (
          <CardEvent key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

export default EventEditor;
