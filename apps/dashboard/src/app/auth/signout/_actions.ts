"use server";

import { redirectIfNotSignedIn } from "@/app/auth/auth";
import { signOut } from "@/auth";

export const signOutAction = async () => {
  await redirectIfNotSignedIn();
  await signOut({ redirectTo: "/auth/signin", redirect: true });
};
