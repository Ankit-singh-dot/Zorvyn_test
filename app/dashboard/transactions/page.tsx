"use client";

import { useFinanceStore } from "@/lib/store";
import { exportToCSV, exportToJSON } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog";
import { HiOutlineArrowDownTray } from "react-icons/hi2";

export default function TransactionsPage() {
  const { role, transactions } = useFinanceStore();

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage and explore your financial transactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <HiOutlineArrowDownTray className="w-4 h-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => exportToCSV(transactions)}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportToJSON(transactions)}>
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {role === "admin" && <AddTransactionDialog />}
        </div>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <TransactionFilters />
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border/50">
        <CardHeader className="pb-0">
          <CardTitle className="text-base font-semibold">
            All Transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <TransactionTable />
        </CardContent>
      </Card>
    </div>
  );
}
