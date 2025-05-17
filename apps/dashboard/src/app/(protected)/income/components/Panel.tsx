"use client";
import { Fragment } from "react";
import { areSameMonth } from "utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UpdateTipeeeDialog } from "./UpdateTipeee";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import type { Payment } from "data-access/_models";
import { aggregateByMonth, diffInPercent, inEuros } from "../_utils";

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
      <div className="flex justify-between">
        <span>{inEuros(total)}</span>
        {evolution ? <span className="text-muted-foreground ml-3">{evolution}</span> : null}
      </div>
    </div>
  );
};

const YearSeparator = ({ index, year }: { index: number; year: number }) => (
  <div className={cn("w-[40%] px-2", index !== 0 && "mt-8!")}>
    <Separator className="mb-1.5 bg-white/30" />
    <span className="text-white/70"> {year}</span>
  </div>
);

/* Update Tipeee Dialog */

const findMissingTipeeeMonths = (payments: Payment[]): Date[] => {
  const missingTipeeeMonths = [];
  const tipeeePayments = payments.filter((payment) => payment.source === "tipeee");
  let previousMonth_utc = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth() - 1, 1));
  const mostRecentTipeeePayment = tipeeePayments.sort((a, b) => b.date.getTime() - a.date.getTime())[0]?.date;

  while (!areSameMonth(previousMonth_utc, mostRecentTipeeePayment)) {
    missingTipeeeMonths.push(previousMonth_utc);
    previousMonth_utc = new Date(Date.UTC(previousMonth_utc.getFullYear(), previousMonth_utc.getMonth() - 1, 1));
  }
  return missingTipeeeMonths;
};

export const Panel = ({ name, payments, highlighted }: { name: string; payments: Payment[]; highlighted: number }) => {
  const paymentsByMonth = aggregateByMonth(payments);
  const missingTipeeeMonths = findMissingTipeeeMonths(payments);

  return (
    <Card className="scrollbar-none min-w-[300px] overflow-scroll border-none bg-black/90 text-white shadow-lg backdrop-blur-md">
      {missingTipeeeMonths.length > 0 && <UpdateTipeeeDialog missingTipeeeMonths={missingTipeeeMonths} />}
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
