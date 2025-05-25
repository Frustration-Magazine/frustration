"use client";
import { useRouter } from "next/navigation";
import { updateTipeee } from "../_actions";
import { ExternalLink } from "lucide-react";
import { TiWarning as WarningIcon } from "react-icons/ti";
import { useState } from "react";
import { formatExplicitMonth, convertDateForDateInput } from "utils";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const UpdateTipeeeDialog = ({ missingTipeeeMonths }: { missingTipeeeMonths: Date[] }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [months, setMonths] = useState<Date[]>(missingTipeeeMonths);

  const shouldClose = isOpen && months.length === 0;
  if (shouldClose) setIsOpen(false);

  const handleUpdateTipeee = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const amount = formData.get("amount");
    const customers = formData.get("customers");
    const date = new Date(formData.get("date") as string);

    const { success } = await updateTipeee({
      amount: Number(amount),
      customers: Number(customers),
      date,
    });

    if (success) {
      router.refresh();
      const remainingMonths = months.filter((month) => month.getTime() !== date.getTime());
      setMonths(remainingMonths);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <WarningIcon className="absolute top-5 right-5 size-8 cursor-pointer" />
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="left" align="start" className="max-w-[225px]">
            <div>Ho Ho... Il manque un ou plusieurs enregistrements Tipeee, cliquez ici pour mettre à jour ✨</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="w-[800px] max-w-[90vw]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Mise à jour Tipeee</DialogTitle>
          <div className="text-muted-foreground gap-x-1 text-sm">
            <span>Reportez les données disponibles à cette adresse 👉 </span>
            <a
              href="https://fr.tipeee.com/frustration-magazine/dashboard"
              target="_blank"
              className="inline-flex items-center gap-x-1 underline"
              rel="noreferrer"
            >
              <span>https://fr.tipeee.com/frustration-magazine/dashboard</span>
              <ExternalLink size={15} />
            </a>
          </div>
        </DialogHeader>
        <DialogDescription className="mb-6 space-y-4">
          {/* Mois */}
          {months.toReversed().map((date, index) => {
            const shouldBeDisabled = index > 0;
            return (
              <form
                key={date.getTime()}
                onSubmit={handleUpdateTipeee}
                className={cn("rounded-md border p-4", shouldBeDisabled && "opacity-50")}
              >
                <div className="mb-2 text-lg font-semibold text-black">{formatExplicitMonth(date, "long")}</div>
                <div className="flex gap-x-4">
                  <Label htmlFor="amount" className="flex grow flex-col gap-y-2">
                    <span>Montant total</span>
                    <Input
                      id="amount"
                      disabled={shouldBeDisabled}
                      name="amount"
                      type="number"
                      min={0}
                      max={1000000}
                      defaultValue={0}
                    />
                  </Label>
                  <Label htmlFor="customers" className="flex grow flex-col gap-y-2">
                    <span>Total d'abonnés</span>
                    <Input
                      id="customers"
                      disabled={shouldBeDisabled}
                      name="customers"
                      type="number"
                      min={0}
                      max={1000000}
                      defaultValue={0}
                    />
                  </Label>
                  <Label htmlFor="date" className="hidden grow flex-col gap-y-2">
                    <span>Date</span>
                    <Input
                      readOnly
                      id="date"
                      disabled={shouldBeDisabled}
                      name="date"
                      type="date"
                      value={convertDateForDateInput(date)}
                    />
                  </Label>
                </div>
                {!shouldBeDisabled && (
                  <Button className="mt-5 ml-auto block" type="submit">
                    Mettre à jour
                  </Button>
                )}
              </form>
            );
          })}
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
