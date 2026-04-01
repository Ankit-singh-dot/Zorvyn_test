"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useFinanceStore } from "@/lib/store";
import { formatCurrency, calculatePercentChange, getMonthKey } from "@/lib/utils";
import {
  HiOutlineBanknotes,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineChartBar,
} from "react-icons/hi2";

interface StatCard {
  label: string;
  value: string;
  change: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

export function SummaryCards() {
  const transactions = useFinanceStore((s) => s.transactions);

  const stats = useMemo<StatCard[]>(() => {
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;

    const currentIncome = transactions
      .filter((t) => getMonthKey(t.date) === currentMonthKey && t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const currentExpense = transactions
      .filter((t) => getMonthKey(t.date) === currentMonthKey && t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const prevIncome = transactions
      .filter((t) => getMonthKey(t.date) === prevMonthKey && t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const prevExpense = transactions
      .filter((t) => getMonthKey(t.date) === prevMonthKey && t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;

    const savingsRate = currentIncome > 0
      ? Math.round(((currentIncome - currentExpense) / currentIncome) * 100)
      : 0;

    const prevSavingsRate = prevIncome > 0
      ? Math.round(((prevIncome - prevExpense) / prevIncome) * 100)
      : 0;

    return [
      {
        label: "Total Balance",
        value: formatCurrency(balance),
        change: calculatePercentChange(currentIncome - currentExpense, prevIncome - prevExpense),
        icon: HiOutlineBanknotes,
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
      },
      {
        label: "Monthly Income",
        value: formatCurrency(currentIncome),
        change: calculatePercentChange(currentIncome, prevIncome),
        icon: HiOutlineArrowTrendingUp,
        color: "text-green-400",
        bgColor: "bg-green-500/10",
      },
      {
        label: "Monthly Expenses",
        value: formatCurrency(currentExpense),
        change: calculatePercentChange(currentExpense, prevExpense),
        icon: HiOutlineArrowTrendingDown,
        color: "text-rose-400",
        bgColor: "bg-rose-500/10",
      },
      {
        label: "Savings Rate",
        value: `${savingsRate}%`,
        change: savingsRate - prevSavingsRate,
        icon: HiOutlineChartBar,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
      },
    ];
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <Card
          key={stat.label}
          className={`card-hover animate-fade-in animate-fade-in-delay-${i + 1} border-border/50`}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold tracking-tight animate-count-up">
                  {stat.value}
                </p>
              </div>
              <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              {stat.change >= 0 ? (
                <HiOutlineArrowTrendingUp className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <HiOutlineArrowTrendingDown className="w-3.5 h-3.5 text-rose-500" />
              )}
              <span
                className={`text-xs font-semibold ${
                  stat.change >= 0 ? "text-green-500" : "text-rose-500"
                }`}
              >
                {stat.change >= 0 ? "+" : ""}
                {stat.change}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
