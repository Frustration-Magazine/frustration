"use client";

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, Legend, XAxis } from "recharts";
import { capitalizeFirst } from "utils/";
import { formatExplicitMonth } from "utils/";
import { cn } from "@/lib/utils";
import { inEuros, debounce } from "../_utils";
import type { Payment, PaymentSource } from "data-access/_models";
import type { Dispatch, SetStateAction } from "react";

type PaymentChart = Omit<Payment, "date" | "type"> & {
  month: string;
};

type ChartData = {
  month: string;
  customers: number;
  stripe?: number;
  helloasso?: number;
  tipeee?: number;
};

const chartConfig = {
  income: {
    label: "Revenus mensuels",
  },
} satisfies ChartConfig;

const GRADIENTS = new Map([
  ["stripe", ["#827cf8", "#b5b2fb"]],
  ["helloasso", ["#56c679", "#8dd9a5"]],
  ["tipeee", ["#C00000", "#FF7F7F"]],
]);

/* ************** */
/* |||||||||||||| */
/* ************** */

export const Chart = ({
  payments,
  setHighlighted,
}: {
  payments: Payment[];
  setHighlighted: Dispatch<SetStateAction<number>>;
}) => {
  let paymentsChart: PaymentChart[] = [];
  paymentsChart = payments.map(({ date, amount, source, customers }) => ({
    month: date.toISOString(),
    amount,
    source,
    customers,
  }));

  const chartData: ChartData[] = paymentsChart
    .toReversed()
    .reduce((acc: ChartData[], { month, amount, source, customers }) => {
      const existingEntry: ChartData | undefined = acc.find((entry: ChartData) => entry.month === month);
      if (existingEntry) {
        existingEntry[source] = existingEntry[source] ? existingEntry[source] + amount : amount;
        existingEntry.customers = existingEntry.customers ? existingEntry.customers + customers : customers;
      } else {
        acc.push({ month, [source]: amount, customers });
      }
      return acc;
    }, []);

  function handleMouseMove() {
    const RECHARTS_DOT_CIRCLE_SELECTOR = ".recharts-area-dots circle";
    const RECHARTS_ACTIVE_DOT_CIRCLE_SELECTOR = ".recharts-active-dot circle";

    const activeDot = document.querySelector(RECHARTS_ACTIVE_DOT_CIRCLE_SELECTOR);
    if (!activeDot) setHighlighted(-1);
    if (activeDot) {
      const activeDotPositionX = activeDot?.getAttribute("cx");
      if (activeDotPositionX) {
        const dots = Array.from(document.querySelectorAll(RECHARTS_DOT_CIRCLE_SELECTOR)).toReversed();
        const dotsPositionX = dots.map((dot) => dot.getAttribute("cx"));
        const indexMonth = dotsPositionX.findIndex((dotX) => dotX === activeDotPositionX);
        setHighlighted(indexMonth);
      }
    }
  }

  function resetHighlighted() {
    setHighlighted(-1);
  }

  return (
    <ChartContainer
      config={chartConfig}
      className={cn(
        "relative max-h-full w-0 grow rounded-md bg-black/5 p-6 backdrop-blur-md",
        "[&_.recharts-cartesian-axis-tick_text]:fill-primary",
        "[&_.recharts-cartesian-axis-tick_text]:font-bold",
        "[&_.recharts-cartesian-axis-tick_text]:opacity-70",
      )}
    >
      <AreaChart
        accessibilityLayer
        data={chartData}
        onMouseMove={debounce(handleMouseMove, 10)}
        onMouseLeave={resetHighlighted}
      >
        <defs>
          <linearGradient
            id="stripeGradient"
            x1="0"
            x2="0"
            y1="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor={GRADIENTS.get("stripe")?.[0]}
              stopOpacity={1}
            />
            <stop
              offset="100%"
              stopColor={GRADIENTS.get("stripe")?.[1]}
              stopOpacity={0}
            />
          </linearGradient>
          <linearGradient
            id="helloassoGradient"
            x1="0"
            x2="0"
            y1="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor={GRADIENTS.get("helloasso")?.[0]}
              stopOpacity={1}
            />
            <stop
              offset="100%"
              stopColor={GRADIENTS.get("helloasso")?.[1]}
              stopOpacity={0}
            />
          </linearGradient>
          <linearGradient
            id="tipeeeGradient"
            x1="0"
            x2="0"
            y1="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor={GRADIENTS.get("tipeee")?.[0]}
              stopOpacity={1}
            />
            <stop
              offset="100%"
              stopColor={GRADIENTS.get("tipeee")?.[1]}
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="month"
          tickLine={false}
          angle={-45}
          axisLine={false}
          fontSize={14}
          padding={{ left: 40, right: 40 }}
          tickMargin={30}
          stroke="#0f172a"
          tickFormatter={(value) => formatExplicitMonth(value, "short")}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              valueFormatter={inEuros}
              xValue="month"
              formatterXValue={(value: string) => formatExplicitMonth(value, "long")}
              labelKey="income"
            />
          }
        />
        <Area
          dataKey="stripe"
          type="monotone"
          fill="url(#stripeGradient)"
          stroke="#625bf6"
          radius={4}
          // Import to keep this dot property so dots are painted but invisible and we can check position of active dot within it whenever we want
          dot={{ fill: "transparent", strokeWidth: 0 }}
        />
        <Area
          dataKey="helloasso"
          type="monotone"
          fill="url(#helloassoGradient)"
          stroke="#359d55"
          radius={4}
        />
        <Area
          dataKey="tipeee"
          type="monotone"
          fill="url(#tipeeeGradient)"
          stroke="#C00000"
          radius={4}
        />
        <Legend
          iconType="plainline"
          iconSize={18}
          wrapperStyle={{
            fontSize: 14,
            paddingTop: "60px",
            fontWeight: "bold",
          }}
          formatter={capitalizeFirst}
        />
      </AreaChart>
    </ChartContainer>
  );
};
