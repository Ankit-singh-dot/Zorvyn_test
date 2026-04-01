"use client";

import { SpendingInsights } from "@/components/insights/spending-insights";
import { MonthlyComparisonChart } from "@/components/insights/monthly-comparison-chart";
import { CategoryTrendsChart } from "@/components/insights/category-trends";
import { SmartObservations } from "@/components/insights/smart-observations";

export default function InsightsPage() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Insights</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Understand your spending patterns and financial health
        </p>
      </div>

      {/* Insight Cards */}
      <SpendingInsights />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MonthlyComparisonChart />
        <CategoryTrendsChart />
      </div>

      {/* Smart Observations */}
      <SmartObservations />
    </div>
  );
}
