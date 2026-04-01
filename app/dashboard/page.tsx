"use client";

import { SummaryCards } from "@/components/dashboard/summary-cards";
import { BalanceTrendChart } from "@/components/dashboard/balance-trend-chart";
import { SpendingBreakdownChart } from "@/components/dashboard/spending-breakdown-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { QuickStats } from "@/components/dashboard/quick-stats";

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Summary Cards */}
      <SummaryCards />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <BalanceTrendChart />
        <SpendingBreakdownChart />
      </div>

      {/* Recent Transactions + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RecentTransactions />
        <div className="grid grid-cols-1 gap-4">
          <QuickStats />
        </div>
      </div>
    </div>
  );
}
