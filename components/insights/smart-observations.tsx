"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinanceStore } from "@/lib/store";
import { formatCurrency, getMonthKey, getCategoryTotals } from "@/lib/utils";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/data";
import { Category } from "@/lib/types";
import {
  HiOutlineSparkles,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineExclamationTriangle,
  HiOutlineCheckCircle,
  HiOutlineLightBulb,
} from "react-icons/hi2";

interface Observation {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  type: "positive" | "negative" | "neutral";
}

export function SmartObservations() {
  const transactions = useFinanceStore((s) => s.transactions);

  const observations = useMemo<Observation[]>(() => {
    const obs: Observation[] = [];
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;

    const currentTxns = transactions.filter((t) => getMonthKey(t.date) === currentMonthKey);
    const prevTxns = transactions.filter((t) => getMonthKey(t.date) === prevMonthKey);

    const currentExpense = currentTxns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const prevExpense = prevTxns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const currentIncome = currentTxns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const prevIncome = prevTxns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);

    const currentSavings = currentIncome - currentExpense;
    const prevSavings = prevIncome - prevExpense;

    // Spending change insight
    if (prevExpense > 0) {
      const change = Math.round(((currentExpense - prevExpense) / prevExpense) * 100);
      if (change > 10) {
        obs.push({
          icon: HiOutlineArrowTrendingUp,
          iconColor: "text-rose-400",
          iconBg: "bg-rose-500/10",
          title: `Spending increased by ${change}%`,
          description: `Your expenses went from ${formatCurrency(prevExpense)} to ${formatCurrency(currentExpense)} this month. Consider reviewing discretionary spending.`,
          type: "negative",
        });
      } else if (change < -10) {
        obs.push({
          icon: HiOutlineArrowTrendingDown,
          iconColor: "text-green-400",
          iconBg: "bg-green-500/10",
          title: `Spending decreased by ${Math.abs(change)}%`,
          description: `Great job! You reduced expenses from ${formatCurrency(prevExpense)} to ${formatCurrency(currentExpense)}.`,
          type: "positive",
        });
      }
    }

    // Savings insight
    if (currentSavings > prevSavings && prevSavings >= 0) {
      obs.push({
        icon: HiOutlineCheckCircle,
        iconColor: "text-emerald-400",
        iconBg: "bg-emerald-500/10",
        title: `Saved ${formatCurrency(currentSavings - prevSavings)} more than last month`,
        description: `Current month savings: ${formatCurrency(currentSavings)}. Keep up the great work!`,
        type: "positive",
      });
    }

    // Category growth - find fastest growing expense category
    const currentCatTotals: Record<string, number> = {};
    const prevCatTotals: Record<string, number> = {};

    currentTxns.filter((t) => t.type === "expense").forEach((t) => {
      currentCatTotals[t.category] = (currentCatTotals[t.category] || 0) + t.amount;
    });
    prevTxns.filter((t) => t.type === "expense").forEach((t) => {
      prevCatTotals[t.category] = (prevCatTotals[t.category] || 0) + t.amount;
    });

    let fastestGrowth = { category: "" as string, percent: 0 };
    Object.keys(currentCatTotals).forEach((cat) => {
      if (prevCatTotals[cat] && prevCatTotals[cat] > 500) {
        const change = Math.round(((currentCatTotals[cat] - prevCatTotals[cat]) / prevCatTotals[cat]) * 100);
        if (change > fastestGrowth.percent) {
          fastestGrowth = { category: cat, percent: change };
        }
      }
    });

    if (fastestGrowth.percent > 15) {
      obs.push({
        icon: HiOutlineExclamationTriangle,
        iconColor: "text-amber-400",
        iconBg: "bg-amber-500/10",
        title: `${CATEGORY_ICONS[fastestGrowth.category as Category] || "📊"} ${fastestGrowth.category} spending up ${fastestGrowth.percent}%`,
        description: `This is your fastest growing expense category. You spent ${formatCurrency(currentCatTotals[fastestGrowth.category])} this month vs ${formatCurrency(prevCatTotals[fastestGrowth.category])} last month.`,
        type: "negative",
      });
    }

    // Overall health insight
    if (currentIncome > 0) {
      const savingsRate = Math.round((currentSavings / currentIncome) * 100);
      if (savingsRate >= 30) {
        obs.push({
          icon: HiOutlineSparkles,
          iconColor: "text-violet-400",
          iconBg: "bg-violet-500/10",
          title: `Excellent savings rate: ${savingsRate}%`,
          description: `You're saving more than 30% of your income. Financial experts recommend 20-30%, so you're doing great!`,
          type: "positive",
        });
      } else if (savingsRate >= 0 && savingsRate < 10) {
        obs.push({
          icon: HiOutlineLightBulb,
          iconColor: "text-yellow-400",
          iconBg: "bg-yellow-500/10",
          title: `Low savings rate: ${savingsRate}%`,
          description: `Consider reducing non-essential spending. Aim for at least 20% savings rate for better financial health.`,
          type: "neutral",
        });
      }
    }

    // Total transactions insight
    obs.push({
      icon: HiOutlineLightBulb,
      iconColor: "text-cyan-400",
      iconBg: "bg-cyan-500/10",
      title: `${transactions.length} total transactions tracked`,
      description: `You have ${currentTxns.length} transactions this month across ${Object.keys(currentCatTotals).length} categories.`,
      type: "neutral",
    });

    return obs;
  }, [transactions]);

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <HiOutlineSparkles className="w-4 h-4 text-primary" />
          Smart Observations
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {observations.map((obs, i) => (
            <div
              key={i}
              className={`flex gap-3 p-3.5 rounded-xl border transition-all duration-200 hover:shadow-sm ${
                obs.type === "positive"
                  ? "border-green-500/20 bg-green-500/5"
                  : obs.type === "negative"
                  ? "border-rose-500/20 bg-rose-500/5"
                  : "border-border/50 bg-muted/30"
              }`}
            >
              <div className={`p-2 rounded-lg ${obs.iconBg} h-fit shrink-0`}>
                <obs.icon className={`w-4 h-4 ${obs.iconColor}`} />
              </div>
              <div className="space-y-0.5 min-w-0">
                <p className="text-sm font-semibold">{obs.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {obs.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
