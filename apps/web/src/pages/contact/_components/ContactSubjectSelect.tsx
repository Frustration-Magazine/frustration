import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState } from "react";

const SUBJECT_OPTIONS = {
  Abonnement: ["Changement d'adresse", "Modification ou résiliation", "Numéro ou livre non reçu"],
  Contribution: ["Proposition d'articles ou de témoignages", 'Rubrique "Chère Frustration" (courrier des lecteurs)'],
  Autre: ["Questions, réactions..."],
};

const SUBSCRIPTION_SUBJECTS = new Set(SUBJECT_OPTIONS.Abonnement);

export default function ContactSubjectSelect({ portalUrl }: { portalUrl: string }) {
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>();

  return (
    <>
      <Select
        name="subject"
        value={selectedSubject}
        onValueChange={setSelectedSubject}
      >
        <SelectTrigger className="w-full hover:cursor-pointer">
          <SelectValue placeholder="Sélectionnez un sujet" />
        </SelectTrigger>
        <SelectContent className="bg-white p-2">
          {Object.entries(SUBJECT_OPTIONS).map(([group, items], groupIndex) => (
            <SelectGroup
              key={group}
              className={cn("space-y-1", groupIndex > 0 && "mt-2")}
            >
              <SelectLabel className="text-xs font-semibold uppercase tracking-wide text-gray-500">{group}</SelectLabel>
              {items.map((item) => (
                <SelectItem
                  key={item}
                  value={item}
                  className="ml-4 w-fit hover:cursor-pointer"
                >
                  {item}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>

      {selectedSubject && SUBSCRIPTION_SUBJECTS.has(selectedSubject) && (
        <div className="flex gap-2 rounded-md bg-green-100 p-4 font-semibold text-green-600">
          <span className="text-xl">💡</span>
          <span>
            Vous pouvez à tout moment modifier vos coordonnées, mettre à jour ou résilier votre abonnement via le ✨{" "}
            <a
              className="text-blue underline"
              href={portalUrl}
              target="_blank"
            >
              portail abonnés
            </a>{" "}
            ✨ en vous connectant avec l'adresse email renseignée lors de votre souscription.
          </span>
        </div>
      )}
    </>
  );
}
