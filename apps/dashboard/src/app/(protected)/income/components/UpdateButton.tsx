"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { triggerUpdatePayments, UpdateStatus } from "../_actions";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";

export function UpdateButton() {
  const [status, setStatus] = useState<UpdateStatus>("idle");
  const { toast } = useToast();
  const router = useRouter();

  const handleUpdate = async () => {
    setStatus("loading");
    
    try {
      const result = await triggerUpdatePayments();
      setStatus(result.status);
      
      if (result.status === "success") {
        toast({
          title: "Succès",
          description: result.message || "Paiements mis à jour avec succès",
          variant: "default",
        });
        // Refresh the page to show updated data
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } else if (result.status === "error") {
        toast({
          title: "Erreur",
          description: result.message || "Erreur lors de la mise à jour",
          variant: "destructive",
        });
      }
    } catch (error) {
      setStatus("error");
      toast({
        title: "Erreur",
        description: "Erreur inattendue lors de la mise à jour",
        variant: "destructive",
      });
    }

    // Reset to idle after 3 seconds
    setTimeout(() => {
      setStatus("idle");
    }, 3000);
  };

  const getButtonContent = () => {
    switch (status) {
      case "loading":
        return (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            <span>Mise à jour...</span>
          </>
        );
      case "success":
        return (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            <span>Mis à jour</span>
          </>
        );
      case "error":
        return (
          <>
            <AlertCircle className="mr-2 h-4 w-4" />
            <span>Erreur</span>
          </>
        );
      default:
        return (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            <span>Mettre à jour</span>
          </>
        );
    }
  };

  const getButtonVariant = () => {
    switch (status) {
      case "success":
        return "default";
      case "error":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <Button 
      className="absolute right-8 h-12" 
      variant={getButtonVariant()}
      onClick={handleUpdate}
      disabled={status === "loading"}
    >
      {getButtonContent()}
    </Button>
  );
} 