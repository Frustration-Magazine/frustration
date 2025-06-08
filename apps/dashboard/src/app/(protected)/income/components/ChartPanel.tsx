"use client";

import { useState } from "react";
import type { Payment } from "data-access/_models";
import { Chart } from "./Chart";
import { Panel } from "./Panel";
import NoData from "./NoData";

export const ChartPanel = ({ payments, type }: { payments: Payment[]; type: string }) => {
  if (payments.length === 0) return <NoData />;

  const [highlighted, setHighlighted] = useState<number>(-1);
  return (
    <section className="flex h-full gap-6">
      <Panel type={type} payments={payments} highlighted={highlighted} />
      <Chart payments={payments} setHighlighted={setHighlighted} />
    </section>
  );
};
