"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Upload, LoaderCircle } from "lucide-react";

import { toast } from "sonner";
import { redeploy, type RefreshOptions } from "@/actions/redeploy";
import { cn } from "@/lib/utils";

type RedeployButtonProps = {
  className?: string;
  refreshOptions?: RefreshOptions;
};

export const RedeployButton = ({ className, refreshOptions = {} }: RedeployButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const { success, error } = await redeploy(refreshOptions);
    if (success) toast.success(success);
    if (error) toast.error(error);
    setLoading(false);
  };

  return (
    <Button
      size="lg"
      disabled={loading}
      className={cn("absolute bottom-4", className)}
      onClick={handleClick}
    >
      {loading ? <LoaderCircle className="animate-spin" /> : <Upload />}
      {loading ? "Demande de redéploiement" : "Mettre à jour le site"}
    </Button>
  );
};
