"use client";

import { useState } from "react";
import { type Payment } from "@data-access/models/transactions";
import { Chart } from "./Chart";
import { Panel } from "./Panel";

export const ChartPanel = ({ payments }: { payments: Payment[] }) => {
  const [highlighted, setHighlighted] = useState<number>(-1);
  return (
    <section className="flex h-full gap-6">
      <Panel name="Tout" payments={payments} highlighted={highlighted} />
      <Chart payments={payments} setHighlighted={setHighlighted} />
    </section>
  );
};
