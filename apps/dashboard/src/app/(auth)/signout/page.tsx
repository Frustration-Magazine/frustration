"use client";

import RedirectionMessage from "@/components/redirection-message";
import { useEffect } from "react";
import { signOutAction } from "./_actions";

export default function SignOut() {
  useEffect(() => {
    signOutAction();
  }, []);

  return <RedirectionMessage href="/signin">En cours de déconnexion...</RedirectionMessage>;
}
