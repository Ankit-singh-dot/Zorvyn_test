"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinanceStore } from "@/lib/store";
import { formatCurrency, getMonthKey, getHighestSpendingCategory } from "@/lib/utils";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/data";
import {
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineScale,
} from "react-icons/hi2";
import { HiFire } from "react-icons/hi2";

export function SpendingInsights() {
  const transactions = useFinanceStore((s) => s.transactions);

  const insights = useMemo(() => {
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;

    const currentMonthTxns = transactions.filter((t) => getMonthKey(t.date) === currentMonthKey);
    const prevMonthTxns = transactions.filter((t) => getMonthKey(t.date) === prevMonthKey);

    const currentIncome = currentMonthTxns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const currentExpense = currentMonthTxns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const prevIncome = prevMonthTxns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const prevExpense = prevMonthTxns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

    const highest = getHighestSpendingCategory(transactions);

    const daysPassed = now.getDate();
    const avgDaily = daysPassed > 0 ? Math.round(currentExpense / daysPassed) : 0;

    const ratio = currentExpense > 0 ? (currentIncome / currentExpense).toFixed(2) : "∞";

    return {
      highest,
      currentIncome,
      currentExpense,
      prevIncome,
      prevExpense,
      avgDaily,
      ratio,
    };
  }, [transactions]);

  const cards = [
    {
      title: "Highest Spending Category",
      value: insights.highest
        ? `${CATEGORY_ICONS[insights.highest.category]} ${insights.highest.category}`
        : "No data",
      sub: insights.highest ? formatCurrency(insights.highest.amount) : "",
      icon: HiFire,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: insights.highest ? CATEGORY_COLORS[insights.highest.category] : undefined,
    },
    {
      title: "Income vs Expenses",
      value: `${insights.ratio}x`,
      sub: `${formatCurrency(insights.currentIncome)} / ${formatCurrency(insights.currentExpense)}`,
      icon: HiOutlineScale,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Monthly Income Change",
      value: insights.prevIncome > 0
        ? `${insights.currentIncome >= insights.prevIncome ? "+" : ""}${Math.round(((insights.currentIncome - insights.prevIncome) / insights.prevIncome) * 100)}%`
        : "N/A",
      sub: `${formatCurrency(insights.prevIncome)} → ${formatCurrency(insights.currentIncome)}`,
      icon: HiOutlineArrowTrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Monthly Expense Change",
      value: insights.prevExpense > 0
        ? `${insights.currentExpense >= insights.prevExpense ? "+" : ""}${Math.round(((insights.currentExpense - insights.prevExpense) / insights.prevExpense) * 100)}%`
        : "N/A",
      sub: `${formatCurrency(insights.prevExpense)} → ${formatCurrency(insights.currentExpense)}`,
      icon: HiOutlineArrowTrendingDown,
      color: "text-rose-400",
      bgColor: "bg-rose-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <Card
          key={card.title}
          className={`card-hover animate-fade-in animate-fade-in-delay-${i + 1} border-border/50`}
          style={card.borderColor ? { borderLeftWidth: 3, borderLeftColor: card.borderColor } : undefined}
        >
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-xl ${card.bgColor}`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div className="space-y-1 min-w-0">
                <p className="text-xs text-muted-foreground font-medium">
                  {card.title}
                </p>
                <p className="text-lg font-bold truncate">{card.value}</p>
                {card.sub && (
                  <p className="text-[11px] text-muted-foreground">{card.sub}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
