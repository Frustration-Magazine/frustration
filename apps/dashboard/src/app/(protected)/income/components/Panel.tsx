"use client";
import { Fragment } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import NoData from "./NoData";

import type { Payment } from "data-access/_models";
import { aggregateByMonth, diffInPercent, inEuros } from "../_utils";
import { cn } from "@/lib/utils";

const Entry = ({
  name,
  total,
  evolution,
  highlighted,
}: {
  name: string;
  total: number;
  evolution: string | null;
  highlighted: boolean;
}) => {
  return (
    <div key={String(total)} className={cn("rounded-md p-2", highlighted && "bg-white text-black")}>
      <h3 className="text-xl font-semibold capitalize">{name} </h3>
      <p className="flex justify-between">
        <span>{inEuros(total)}</span>
        {evolution ? <span className="text-muted-foreground ml-3">{evolution}</span> : null}
      </p>
    </div>
  );
};

const YearSeparator = ({ index, year }: { index: number; year: number }) => (
  <div className={cn("w-[40%] px-2", index !== 0 && "mt-8!")}>
    <Separator className="mb-1.5 bg-white/30" />
    <span className="text-white/70"> {year}</span>
  </div>
);

export const Panel = ({ name, payments, highlighted }: { name: string; payments: Payment[]; highlighted: number }) => {
  if (payments.length === 0) return <NoData />;

  const paymentsByMonth = aggregateByMonth(payments);

  return (
    <Card className="scrollbar-none min-w-[300px] overflow-scroll border-none bg-black/90 text-white shadow-lg backdrop-blur-md">
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
            needsSeparator = date.getFullYear() !== prevDate.getFullYear();
            evolution = diffInPercent(prevAmount, amount);
          }

          const month = date.toLocaleDateString("fr-FR", { month: "long" });

          return (
            <Fragment key={date.getTime()}>
              {index === 0 && <YearSeparator index={index} year={date.getFullYear()} />}
              <Entry name={month} total={amount} evolution={evolution} highlighted={highlighted === index} />
              {needsSeparator && <YearSeparator index={index} year={prevPayment.date.getFullYear()} />}
            </Fragment>
          );
        })}
      </CardContent>
    </Card>
  );
};
