"use client";

import { useActionState, useEffect } from "react";

import { BiMailSend } from "react-icons/bi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { sendLink as serverAction } from "./_actions";
import { schema } from "./_models";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type ResponseStatus } from "@/actions/models";

const initial: ResponseStatus = {
  success: null,
  error: null,
};

export default function () {
  const [state, sendLink, pending] = useActionState(serverAction, initial);

  useEffect(() => {
    if (state.success) toast.success("Succès", { description: state.success });
    if (state.error) toast.error("Erreur", { description: state.error });
  }, [state]);

  // 📝 Form
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  /* 📨 */
  /* -- */
  const Email = (
    <FormField
      control={form.control as any}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input
              placeholder="frustrationmagazine@gmail.com"
              disabled={pending}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  /* 🆕 */
  /* -- */
  const Send = (
    <Button
      disabled={pending}
      className="mx-auto w-fit"
      type="submit"
    >
      <BiMailSend
        size={17}
        className="mr-2"
      />
      Recevoir un lien de connexion
    </Button>
  );

  /* ---------- */
  /*     UI     */
  /* -----------*/

  return (
    <Form {...(form as any)}>
      <form
        className="group flex flex-col gap-[20px] bg-white p-5"
        action={sendLink}
      >
        {Email}
        {Send}
      </form>
    </Form>
  );
}
