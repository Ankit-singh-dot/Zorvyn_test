"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFinanceStore } from "@/lib/store";
import { formatCurrency, getMonthKey, getMonthYear } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Period = "3M" | "6M" | "ALL";

export function BalanceTrendChart() {
  const [period, setPeriod] = useState<Period>("6M");
  const transactions = useFinanceStore((s) => s.transactions);

  const data = useMemo(() => {
    // Group by month
    const monthlyData: Record<
      string,
      { income: number; expense: number }
    > = {};

    transactions.forEach((t) => {
      const key = getMonthKey(t.date);
      if (!monthlyData[key]) {
        monthlyData[key] = { income: 0, expense: 0 };
      }
      if (t.type === "income") {
        monthlyData[key].income += t.amount;
      } else {
        monthlyData[key].expense += t.amount;
      }
    });

    // Sort by date and calculate running balance
    const sortedKeys = Object.keys(monthlyData).sort();
    let runningBalance = 0;

    const chartData = sortedKeys.map((key) => {
      runningBalance += monthlyData[key].income - monthlyData[key].expense;
      return {
        month: getMonthYear(key + "-01"),
        balance: runningBalance,
        income: monthlyData[key].income,
        expense: monthlyData[key].expense,
      };
    });

    // Filter based on period
    if (period === "3M") return chartData.slice(-3);
    if (period === "6M") return chartData.slice(-6);
    return chartData;
  }, [transactions, period]);

  return (
    <Card className="col-span-1 lg:col-span-2 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Balance Trend</CardTitle>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
          <TabsList className="h-8">
            <TabsTrigger value="3M" className="text-xs px-3 h-6">
              3M
            </TabsTrigger>
            <TabsTrigger value="6M" className="text-xs px-3 h-6">
              6M
            </TabsTrigger>
            <TabsTrigger value="ALL" className="text-xs px-3 h-6">
              All
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
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
                itemStyle={{ color: "hsl(0, 0%, 90%)", fontSize: "13px", fontWeight: 600 }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={((value: any) => [formatCurrency(Number(value)), "Balance"]) as any}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="hsl(160, 84%, 39%)"
                strokeWidth={2.5}
                fill="url(#balanceGradient)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: "hsl(160, 84%, 39%)",
                  stroke: "hsl(230, 25%, 14%)",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
