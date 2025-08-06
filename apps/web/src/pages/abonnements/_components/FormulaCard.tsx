import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { type Formula } from "../_models";

const FormulaCard = ({
  id,
  name,
  amount,
  items,
  selectedAmount,
  select,
}: {
  id: Formula | "";
  name: string;
  amount: number;
  items: string[];
  selectedAmount: number;
  select: () => void;
}) => (
  <li
    data-formula={id}
    className="transition-transform [&:has(input:checked)]:scale-105"
  >
    <input
      id={id}
      type="radio"
      name="subscription"
      value={amount / 100}
      className="group peer hidden appearance-none"
      checked={amount === selectedAmount}
      onChange={select}
    />
    <label
      htmlFor={id}
      className="peer-checked peer-checked:text-primary block cursor-pointer rounded-lg peer-checked:bg-black"
    >
      <Card className="rounded-lg">
        <CardHeader className="font-bakbak relative mb-2 mt-4 px-5 py-0 text-2xl uppercase">
          <CardTitle className="font-normal!">{name}</CardTitle>
        </CardHeader>
        <CardContent className="space-between flex items-center px-5 py-0">
          <ul className="grow -space-y-1 text-base">
            {items.map((item: any) => (
              <li key={item.toLowerCase().replace(/\s/g, "")}>{item}</li>
            ))}
          </ul>
          <Check className="check-card" />
        </CardContent>
        <CardFooter className="mb-4 mt-2 px-5 py-0">
          <p>
            <span className="mr-1.5 text-3xl font-bold">{amount / 100}€</span>
            <span className="text-sm">tous les mois</span>
          </p>
        </CardFooter>
      </Card>
    </label>
  </li>
);

export default FormulaCard;
