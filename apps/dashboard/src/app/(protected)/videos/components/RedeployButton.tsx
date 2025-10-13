"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { redeploy } from "../_actions";

import { ImUpload } from "react-icons/im";
import { TbLoaderQuarter } from "react-icons/tb";

const isProduction = process.env.NODE_ENV === "production";

export default function RedeployButton() {
  const [loading, setLoading] = useState(false);

  const [requestStatus, setRequestStatus] = useState<
    | {
        success: string | null;
        error: string | null;
      }
    | undefined
  >({ success: null, error: null });

  const handleClick = async () => {
    setLoading(true);
    const status = await redeploy();
    setRequestStatus(status);
    setLoading(false);
  };

  const { toast } = useToast();
  useEffect(
    function displayToaster() {
      if (requestStatus?.success) {
        toast({
          title: "✅ Succès",
          description: requestStatus?.success,
        });
      }

      if (requestStatus?.error) {
        toast({
          title: "Une erreur s'est produite",
          description: requestStatus?.error,
          variant: "destructive",
        });
      }
    },
    [requestStatus, toast],
  );

  // ❌ Early return | Not redeploying in development
  if (!isProduction) return null;

  return (
    <Button
      size="lg"
      disabled={loading}
      className="flex gap-2 py-4"
      onClick={handleClick}
    >
      {loading ? <TbLoaderQuarter className="animate-spin" /> : <ImUpload />}
      {loading ? "Demande de redéploiement" : "Mettre à jour le site"}
    </Button>
  );
}
