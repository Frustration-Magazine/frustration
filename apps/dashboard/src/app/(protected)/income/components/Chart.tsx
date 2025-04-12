"use client";

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, Legend, XAxis } from "recharts";
import { capitalizeFirst } from "@utils/strings";
import { formatExplicitMonth } from "@utils/dates";
import { cn } from "@/lib/utils";
import { inEuros, debounce } from "../_utils";

const chartConfig = {
  income: {
    label: "Revenus mensuels",
  },
} satisfies ChartConfig;

export const Chart = ({ payments, setHighlighted }: { payments: any[]; setHighlighted: any }) => {
  let chartData = [];

  chartData = payments.map(({ date, amount, source }) => ({
    month: date.toISOString(),
    amount,
    source,
  }));

  chartData = chartData.toReversed().reduce((acc: any, { month, amount, source }) => {
    const existingEntry: any = acc.find((entry: any) => entry.month === month);
    if (existingEntry) {
      existingEntry[source] = existingEntry[source] ? existingEntry[source] + amount : amount;
    } else {
      acc.push({ month, [source]: amount });
    }
    return acc;
  }, []);

  function handleMouseMove() {
    const RECHARTS_ACTIVE_DOT_CIRCLE_SELECTOR = ".recharts-active-dot circle";
    const RECHARTS_DOT_CIRCLE_SELECTOR = ".recharts-area-dots circle";

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

  /* ************** */
  /*     🚀 UI      */
  /* ************** */

  return (
    <ChartContainer
      config={chartConfig}
      className={cn(
        "relative max-h-full w-0 grow rounded-md bg-black/5 p-6 backdrop-blur-md",
        "[&_.recharts-cartesian-axis-tick_text]:fill-primary [&_.recharts-cartesian-axis-tick_text]:font-bold [&_.recharts-cartesian-axis-tick_text]:opacity-70",
      )}
    >
      <AreaChart
        accessibilityLayer
        data={chartData}
        onMouseMove={debounce(handleMouseMove, 10)}
        onMouseLeave={resetHighlighted}
      >
        <defs>
          <linearGradient id="stripeGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#827cf8" stopOpacity={1} />
            <stop offset="100%" stopColor="#b5b2fb" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="helloassoGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#56c679" stopOpacity={1} />
            <stop offset="100%" stopColor="#8dd9a5" stopOpacity={0} />
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
              formatterXValue={(value: any) => formatExplicitMonth(value, "long")}
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
        <Area dataKey="helloasso" type="monotone" fill="url(#helloassoGradient)" stroke="#359d55" radius={4} />
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
