"use client";

import RedirectionMessage from "@/components/redirection-message";
import { useEffect } from "react";
import { signOutAction } from "./_actions";

function SignOut() {
  useEffect(() => {
    signOutAction();
  }, []);

  return <RedirectionMessage href="auth/signin">En cours de déconnexion...</RedirectionMessage>;
}

export default SignOut;
