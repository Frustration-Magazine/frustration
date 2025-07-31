"use client";
import { Fragment } from "react";
import { areSameMonth } from "utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UpdateTipeeeDialog } from "./UpdateTipeee";
import { Separator } from "@/components/ui/separator";
import Stripe from "../assets/stripe.png";
import Tipeee from "../assets/tipeee.png";
import Helloasso from "../assets/helloasso.png";
import { cn } from "@/lib/utils";
import type { Payment } from "data-access/_models";
import { aggregateByMonth, diffInPercent, inEuros } from "../_utils";
const Entry = ({
  name,
  total,
  evolution,
  highlighted,
  hasStripe,
  hasTipeee,
  hasHelloasso,
}: {
  name: string;
  total: number;
  evolution: string | null;
  highlighted: boolean;
  hasStripe: boolean;
  hasTipeee: boolean;
  hasHelloasso: boolean;
}) => {
  return (
    <div
      key={String(total)}
      className={cn("rounded-md p-2", highlighted && "bg-white text-black")}
    >
      <h3 className="text-xl font-semibold capitalize">{name} </h3>
      <div className="flex justify-between">
        <span>{inEuros(total)}</span>
        {evolution ? <span className="text-muted-foreground ml-3">{evolution}</span> : null}
      </div>
      <div className="mt-1 flex justify-between">
        {hasStripe && (
          <img
            src={Stripe.src}
            alt="Stripe"
            className="h-4 w-4"
          />
        )}
        {hasTipeee && (
          <img
            src={Tipeee.src}
            alt="Tipeee"
            className="h-4 w-4"
          />
        )}
        {hasHelloasso && (
          <img
            src={Helloasso.src}
            alt="Helloasso"
            className="h-4 w-4"
          />
        )}
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
  const missingTipeeeMonths: Date[] = [];
  if (payments.some((payment) => payment.source === "tipeee")) {
    const tipeeePayments = payments.filter((payment) => payment.source === "tipeee");
    let previousMonth_utc = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth() - 1, 1));
    const mostRecentTipeeePayment = tipeeePayments.sort((a, b) => b.date.getTime() - a.date.getTime())[0]?.date;

    while (!areSameMonth(previousMonth_utc, mostRecentTipeeePayment)) {
      missingTipeeeMonths.push(previousMonth_utc);
      previousMonth_utc = new Date(Date.UTC(previousMonth_utc.getFullYear(), previousMonth_utc.getMonth() - 1, 1));
    }
  }
  return missingTipeeeMonths;
};

export const Panel = ({ type, payments, highlighted }: { type: string; payments: Payment[]; highlighted: number }) => {
  const paymentsByMonth = aggregateByMonth(payments);
  const missingTipeeeMonths = findMissingTipeeeMonths(payments);

  const title =
    type === "all" ? "Tout" : type === "subscriptions" ? "Abonnements" : type === "donations" ? "Dons" : "Tout";
  return (
    <Card className="scrollbar-none min-w-[300px] overflow-scroll border-none bg-black/90 text-white shadow-lg backdrop-blur-md">
      {missingTipeeeMonths.length > 0 && <UpdateTipeeeDialog missingTipeeeMonths={missingTipeeeMonths} />}
      <CardHeader className="text-3xl font-semibold">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 px-4">
        {paymentsByMonth.map(({ date, amount, customers }, index) => {
          const prevPayment = paymentsByMonth[index + 1];
          let needsSeparator = false;
          let evolutionAmount = null;
          let evolutionCustomers = null;

          if (prevPayment) {
            const { date: prevDate, amount: prevAmount, customers: prevCustomers } = prevPayment;
            needsSeparator = date.getFullYear() !== prevDate.getFullYear();
            evolutionAmount = diffInPercent(prevAmount, amount);
            evolutionCustomers = diffInPercent(prevCustomers, customers);
          }

          const monthFormatted = date.toLocaleDateString("fr-FR", { month: "long" });

          const hasStripe = payments.some((payment) => areSameMonth(payment.date, date) && payment.source === "stripe");
          const hasTipeee = payments.some((payment) => areSameMonth(payment.date, date) && payment.source === "tipeee");
          const hasHelloasso = payments.some(
            (payment) => areSameMonth(payment.date, date) && payment.source === "helloasso",
          );

          return (
            <Fragment key={date.getTime()}>
              {index === 0 && (
                <YearSeparator
                  index={index}
                  year={date.getFullYear()}
                />
              )}
              <div
                key={String(amount)}
                className={cn("rounded-md p-2", highlighted === index && "bg-white text-black")}
              >
                <h3 className="text-xl font-semibold capitalize">{monthFormatted} </h3>
                <div className="flex justify-between text-sm">
                  <span>💸 {inEuros(amount)}</span>
                  {evolutionAmount ? <span className="text-muted-foreground ml-3">{evolutionAmount}</span> : null}
                </div>
                {type === "subscriptions" && (
                  <div className="flex justify-between text-sm">
                    <span>👥 {customers} abonnés</span>
                    {evolutionCustomers ? (
                      <span className="text-muted-foreground ml-3">{evolutionCustomers}</span>
                    ) : null}
                  </div>
                )}
                <div className="mt-1 flex gap-x-2">
                  {hasHelloasso && (
                    <img
                      src={Helloasso.src}
                      alt="Helloasso"
                      className="h-4 w-4 rounded-md"
                    />
                  )}
                  {hasStripe && (
                    <img
                      src={Stripe.src}
                      alt="Stripe"
                      className="h-4 w-4 rounded-md"
                    />
                  )}
                  {hasTipeee && (
                    <img
                      src={Tipeee.src}
                      alt="Tipeee"
                      className="h-4 w-4 rounded-md"
                    />
                  )}
                </div>
              </div>
              {needsSeparator && (
                <YearSeparator
                  index={index}
                  year={prevPayment.date.getFullYear()}
                />
              )}
            </Fragment>
          );
        })}
      </CardContent>
    </Card>
  );
};
