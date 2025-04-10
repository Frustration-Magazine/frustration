"use client";
import { Fragment } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Separator } from "@/components/Separator";
import NoData from "./NoData";

import { type Payment } from "@data-access/models/transactions";
import { aggregateByMonth, diffInPercent, inEuros } from "../_utils";
import { cn } from "@/utils/style";

const Entry = ({
  name,
  total,
  evolution,
  // highlighted,
}: {
  name: string;
  total: number;
  evolution: string | null;
  // highlighted: boolean;
}) => {
  return (
    <div key={String(total)} className={cn("rounded-md p-2" /* highlighted && "bg-white text-black" */)}>
      <h3 className="text-xl font-semibold capitalize">{name} </h3>
      <p className="flex justify-between">
        <span>{inEuros(total)}</span>
        {evolution ? <span className="ml-3 text-muted-foreground">{evolution}</span> : null}
      </p>
    </div>
  );
};

const YearSeparator = ({ index, year }: { index: number; year: number }) => (
  <div className={cn("w-[40%] px-2", index !== 0 && "!mt-8")}>
    <Separator className="mb-1.5 bg-white/30" />
    <span className="text-white/70"> {year}</span>
  </div>
);

const Panel = ({ name, payments }: { name: string; payments: Payment[] }) => {
  // const [highlightedMonth, setHighlightedMonth] = useState<number>(-1);

  if (payments.length === 0) return <NoData />;

  const paymentsByMonth = aggregateByMonth(payments);

  return (
    <Card className="min-w-[300px] overflow-scroll border-none bg-black/90 text-white shadow-lg backdrop-blur-md">
      <CardHeader className="text-3xl font-semibold">
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 px-4">
        {paymentsByMonth.map(({ date, amount }, index) => {
          const prevPayment = paymentsByMonth[index + 1];
          let needsSeparator = false;
          let evolution = null;

          if (prevPayment) {
            const { date: prevDate, amount: prevAmount } = prevPayment;
            needsSeparator = index === 0 || date.getFullYear() !== prevDate.getFullYear();
            evolution = diffInPercent(prevAmount, amount);
          }

          // const highlighted = index === highlightedMonth;
          const month = date.toLocaleDateString("fr-FR", { month: "long" });

          return (
            <Fragment key={date.getTime()}>
              {needsSeparator && <YearSeparator index={index} year={prevPayment.date.getFullYear()} />}
              <Entry name={month} total={amount} evolution={evolution} />
            </Fragment>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default Panel;
