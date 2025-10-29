"use client";

import { useActionState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SendIcon } from "lucide-react";

import { DEFAULT_RESPONSE_STATUS } from "@/actions/_models";
import { signInMagicLinkAction } from "./_actions";
import { signInSchema } from "./_models";

export const SignInForm = () => {
  const [state, action, pending] = useActionState(signInMagicLinkAction, { ...DEFAULT_RESPONSE_STATUS });

  useEffect(() => {
    if (state.success) toast.success(state.success);
    if (state.error) toast.error(state.error);
  }, [state]);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <Form {...form}>
      <form
        className="group flex flex-col gap-[20px] bg-white p-5"
        action={action}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>📧 Email</FormLabel>
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

        <Button
          disabled={pending}
          className="mx-auto w-fit"
          type="submit"
        >
          <SendIcon />
          {pending ? "Envoi en cours..." : "Recevoir un lien de connexion"}
        </Button>
      </form>
    </Form>
  );
};
