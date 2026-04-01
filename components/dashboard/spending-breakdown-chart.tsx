"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinanceStore } from "@/lib/store";
import { formatCurrency, getCategoryTotals } from "@/lib/utils";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/data";
import { Category } from "@/lib/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export function SpendingBreakdownChart() {
  const transactions = useFinanceStore((s) => s.transactions);

  const { chartData, total } = useMemo(() => {
    const totals = getCategoryTotals(transactions);
    const entries = Object.entries(totals) as [Category, number][];
    entries.sort((a, b) => b[1] - a[1]);

    const total = entries.reduce((sum, [, amount]) => sum + amount, 0);

    const data = entries.map(([category, amount]) => ({
      name: category,
      value: amount,
      color: CATEGORY_COLORS[category],
      icon: CATEGORY_ICONS[category],
      percent: total > 0 ? Math.round((amount / total) * 100) : 0,
    }));

    return { chartData: data, total };
  }, [transactions]);

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Spending Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col items-center">
          {/* Donut Chart */}
          <div className="relative h-[200px] w-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      opacity={0.85}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(230, 25%, 14%)",
                    border: "1px solid hsl(230, 20%, 24%)",
                    borderRadius: "10px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                    padding: "10px 14px",
                  }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={((value: any) => [formatCurrency(Number(value))]) as any}
                  labelStyle={{ color: "hsl(0, 0%, 90%)", fontSize: "13px", fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-bold">{formatCurrency(total)}</p>
            </div>
          </div>

          {/* Legend */}
          <div className="w-full mt-4 space-y-2 max-h-[180px] overflow-y-auto pr-1">
            {chartData.slice(0, 6).map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground truncate text-xs">
                    {item.icon} {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-xs font-semibold">
                    {formatCurrency(item.value)}
                  </span>
                  <span className="text-[10px] text-muted-foreground w-8 text-right">
                    {item.percent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
