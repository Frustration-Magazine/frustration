"use client";

import { useActionState, useEffect } from "react";

import { BiMailSend } from "react-icons/bi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { sendLink as serverAction } from "./_actions";
import { schema, type Status } from "./_models";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/useToast";

const initial: Status = {
  success: "",
  error: "",
};

export default function () {
  const [state, sendLink, pending] = useActionState(serverAction, initial);

  const { toast } = useToast();
  useEffect(() => {
    if (state.success) toast({ title: "✅ Succès", description: state.success });
    if (state.error)
      toast({
        title: "Erreur",
        description: state.error,
        variant: "destructive",
      });
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
