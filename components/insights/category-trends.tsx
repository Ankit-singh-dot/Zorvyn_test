"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinanceStore } from "@/lib/store";
import { getMonthKey, getMonthYear, formatCurrency } from "@/lib/utils";
import { CATEGORY_COLORS } from "@/lib/data";
import { Category } from "@/lib/types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function CategoryTrendsChart() {
  const transactions = useFinanceStore((s) => s.transactions);

  const { data, topCategories } = useMemo(() => {
    // Find top 5 expense categories by total spending
    const categoryTotals: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

    const topCats = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cat]) => cat as Category);

    // Build monthly data for top categories
    const monthly: Record<string, Record<string, number>> = {};

    transactions
      .filter((t) => t.type === "expense" && topCats.includes(t.category))
      .forEach((t) => {
        const key = getMonthKey(t.date);
        if (!monthly[key]) monthly[key] = {};
        monthly[key][t.category] = (monthly[key][t.category] || 0) + t.amount;
      });

    const sortedKeys = Object.keys(monthly).sort();
    const chartData = sortedKeys.map((key) => {
      const entry: Record<string, string | number> = {
        month: getMonthYear(key + "-01"),
      };
      topCats.forEach((cat) => {
        entry[cat] = monthly[key][cat] || 0;
      });
      return entry;
    });

    return { data: chartData, topCategories: topCats };
  }, [transactions]);

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Category Spending Trends
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(0, 0%, 40%)"
                opacity={0.15}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(0, 0%, 55%)" }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(0, 0%, 55%)" }}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(230, 25%, 14%)",
                  border: "1px solid hsl(230, 20%, 24%)",
                  borderRadius: "10px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                  padding: "12px 16px",
                }}
                labelStyle={{ color: "hsl(0, 0%, 70%)", fontSize: "12px", marginBottom: "4px" }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={((value: any) => [formatCurrency(Number(value))]) as any}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "16px" }} />
              {topCategories.map((cat) => (
                <Area
                  key={cat}
                  type="monotone"
                  dataKey={cat}
                  stackId="1"
                  stroke={CATEGORY_COLORS[cat]}
                  fill={CATEGORY_COLORS[cat]}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
