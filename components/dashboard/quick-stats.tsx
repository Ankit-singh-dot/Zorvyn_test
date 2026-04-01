"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useFinanceStore } from "@/lib/store";
import { formatCurrency, getHighestSpendingCategory, getMonthKey } from "@/lib/utils";
import { CATEGORY_ICONS } from "@/lib/data";
import {
  HiOutlineReceiptPercent,
  HiOutlineCalendarDays,
  HiOutlineHashtag,
} from "react-icons/hi2";

export function QuickStats() {
  const transactions = useFinanceStore((s) => s.transactions);

  const stats = useMemo(() => {
    const highest = getHighestSpendingCategory(transactions);

    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const currentMonthTxns = transactions.filter(
      (t) => getMonthKey(t.date) === currentMonthKey
    );

    const totalExpenseThisMonth = currentMonthTxns
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysPassed = now.getDate();
    const avgDaily = daysPassed > 0 ? Math.round(totalExpenseThisMonth / daysPassed) : 0;

    return [
      {
        label: "Top Category",
        value: highest ? `${CATEGORY_ICONS[highest.category]} ${highest.category}` : "—",
        sub: highest ? formatCurrency(highest.amount) : "",
        icon: HiOutlineReceiptPercent,
        color: "text-amber-400",
        bgColor: "bg-amber-500/10",
      },
      {
        label: "Avg Daily Spend",
        value: formatCurrency(avgDaily),
        sub: `${daysPassed} days tracked`,
        icon: HiOutlineCalendarDays,
        color: "text-cyan-400",
        bgColor: "bg-cyan-500/10",
      },
      {
        label: "Transactions",
        value: `${transactions.length}`,
        sub: `${currentMonthTxns.length} this month`,
        icon: HiOutlineHashtag,
        color: "text-violet-400",
        bgColor: "bg-violet-500/10",
      },
    ];
  }, [transactions]);

  return (
    <>
      {stats.map((stat) => (
        <Card key={stat.label} className="card-hover border-border/50">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="space-y-1 min-w-0">
                <p className="text-xs text-muted-foreground font-medium">
                  {stat.label}
                </p>
                <p className="text-sm font-bold truncate">{stat.value}</p>
                {stat.sub && (
                  <p className="text-[11px] text-muted-foreground">{stat.sub}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
