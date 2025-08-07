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

const SUBJECT_OPTIONS = [
  {
    label: "Abonnement",
    items: [
      { value: "subscription-address", label: "Changement d'adresse" },
      { value: "subscription-modification", label: "Modification ou résiliation" },
      { value: "subscription-missing", label: "Numéro ou livre non reçu" },
    ],
  },
  {
    label: "Contribution",
    items: [
      { value: "content-proposal", label: "Proposition d'articles ou de témoignages" },
      { value: "reader-mail", label: 'Rubrique "Chère Frustration" (courrier des lecteurs)' },
    ],
  },
  {
    label: "Autre",
    items: [{ value: "other", label: "Questions, réactions..." }],
  },
];

export default function ContactSubjectSelect() {
  return (
    <Select name="subject">
      <SelectTrigger className="w-full hover:cursor-pointer">
        <SelectValue placeholder="Sélectionnez un sujet" />
      </SelectTrigger>
      <SelectContent className="bg-white p-2">
        {SUBJECT_OPTIONS.map((group, groupIndex) => (
          <SelectGroup
            key={group.label}
            className={cn("space-y-1", groupIndex > 0 && "mt-2")}
          >
            <SelectLabel className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {group.label}
            </SelectLabel>
            {group.items.map((item) => (
              <SelectItem
                key={item.value}
                value={item.label}
                className="ml-4 w-fit hover:cursor-pointer"
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
