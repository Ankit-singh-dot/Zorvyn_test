"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFinanceStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/data";
import { HiOutlineArrowRight } from "react-icons/hi2";

export function RecentTransactions() {
  const transactions = useFinanceStore((s) => s.transactions);

  const recent = useMemo(() => {
    return [...transactions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5);
  }, [transactions]);

  return (
    <Card className="col-span-1 lg:col-span-2 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">
          Recent Transactions
        </CardTitle>
        <Link 
          href="/dashboard/transactions"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          View all <HiOutlineArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1">
          {recent.map((txn) => (
            <div
              key={txn.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              {/* Category Icon */}
              <div
                className="flex items-center justify-center w-10 h-10 rounded-xl text-lg shrink-0"
                style={{
                  backgroundColor: `${CATEGORY_COLORS[txn.category]}15`,
                }}
              >
                {CATEGORY_ICONS[txn.category]}
              </div>

              {/* Description & Category */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {txn.description}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 h-4 font-normal"
                  >
                    {txn.category}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">
                    {formatDate(txn.date)}
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div className="text-right shrink-0">
                <p
                  className={`text-sm font-semibold tabular-nums ${
                    txn.type === "income" ? "text-green-500" : "text-rose-500"
                  }`}
                >
                  {txn.type === "income" ? "+" : "-"}
                  {formatCurrency(txn.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
