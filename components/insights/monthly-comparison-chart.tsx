"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinanceStore } from "@/lib/store";
import { formatCurrency, getMonthKey, getMonthYear } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function MonthlyComparisonChart() {
  const transactions = useFinanceStore((s) => s.transactions);

  const data = useMemo(() => {
    const monthly: Record<string, { income: number; expense: number }> = {};

    transactions.forEach((t) => {
      const key = getMonthKey(t.date);
      if (!monthly[key]) monthly[key] = { income: 0, expense: 0 };
      if (t.type === "income") {
        monthly[key].income += t.amount;
      } else {
        monthly[key].expense += t.amount;
      }
    });

    return Object.keys(monthly)
      .sort()
      .map((key) => ({
        month: getMonthYear(key + "-01"),
        Income: monthly[key].income,
        Expenses: monthly[key].expense,
      }));
  }, [transactions]);

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Monthly Income vs Expenses
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
              <Legend
                wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
              />
              <Bar
                dataKey="Income"
                fill="hsl(142, 71%, 45%)"
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
              <Bar
                dataKey="Expenses"
                fill="hsl(0, 84%, 60%)"
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
