"use client";

import { useMemo, useState } from "react";
import { useFinanceStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction } from "@/lib/types";
import { EditTransactionDialog } from "./edit-transaction-dialog";
import {
  HiOutlineChevronUp,
  HiOutlineChevronDown,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineInboxStack,
} from "react-icons/hi2";

const PAGE_SIZE = 10;

export function TransactionTable() {
  const { role, sort, toggleSort, deleteTransaction, getFilteredTransactions } =
    useFinanceStore();
  const [page, setPage] = useState(0);
  const [editingTxn, setEditingTxn] = useState<Transaction | null>(null);

  const filtered = useMemo(() => getFilteredTransactions(), [getFilteredTransactions]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const SortIcon = ({ field }: { field: keyof Transaction }) => {
    if (sort.field !== field) return null;
    return sort.direction === "asc" ? (
      <HiOutlineChevronUp className="w-3 h-3 ml-1 inline" />
    ) : (
      <HiOutlineChevronDown className="w-3 h-3 ml-1 inline" />
    );
  };

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <HiOutlineInboxStack className="w-12 h-12 text-muted-foreground/40 mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground">
          No transactions found
        </h3>
        <p className="text-sm text-muted-foreground/60 mt-1 max-w-sm">
          Try adjusting your filters or add a new transaction to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block rounded-lg border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => toggleSort("date")}
              >
                Date <SortIcon field="date" />
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead
                className="text-right cursor-pointer select-none"
                onClick={() => toggleSort("amount")}
              >
                Amount <SortIcon field="amount" />
              </TableHead>
              {role === "admin" && (
                <TableHead className="text-right w-[100px]">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((txn) => (
              <TableRow key={txn.id} className="group">
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(txn.date)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{CATEGORY_ICONS[txn.category]}</span>
                    <span className="text-sm font-medium">{txn.description}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="text-[11px] font-normal"
                    style={{
                      borderColor: `${CATEGORY_COLORS[txn.category]}30`,
                      color: CATEGORY_COLORS[txn.category],
                      backgroundColor: `${CATEGORY_COLORS[txn.category]}10`,
                    }}
                  >
                    {txn.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={txn.type === "income" ? "default" : "destructive"}
                    className="text-[10px] capitalize"
                  >
                    {txn.type}
                  </Badge>
                </TableCell>
                <TableCell
                  className={`text-right text-sm font-semibold tabular-nums ${
                    txn.type === "income" ? "text-green-500" : "text-rose-500"
                  }`}
                >
                  {txn.type === "income" ? "+" : "-"}
                  {formatCurrency(txn.amount)}
                </TableCell>
                {role === "admin" && (
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setEditingTxn(txn)}
                      >
                        <HiOutlinePencilSquare className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => deleteTransaction(txn.id)}
                      >
                        <HiOutlineTrash className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-2">
        {paginated.map((txn) => (
          <div
            key={txn.id}
            className="p-4 rounded-lg border border-border/50 bg-card space-y-2"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{CATEGORY_ICONS[txn.category]}</span>
                <div>
                  <p className="text-sm font-medium">{txn.description}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(txn.date)}</p>
                </div>
              </div>
              <p
                className={`text-sm font-bold tabular-nums ${
                  txn.type === "income" ? "text-green-500" : "text-rose-500"
                }`}
              >
                {txn.type === "income" ? "+" : "-"}
                {formatCurrency(txn.amount)}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="text-[10px]"
                  style={{
                    color: CATEGORY_COLORS[txn.category],
                    backgroundColor: `${CATEGORY_COLORS[txn.category]}10`,
                  }}
                >
                  {txn.category}
                </Badge>
                <Badge
                  variant={txn.type === "income" ? "default" : "destructive"}
                  className="text-[10px] capitalize"
                >
                  {txn.type}
                </Badge>
              </div>
              {role === "admin" && (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setEditingTxn(txn)}
                  >
                    <HiOutlinePencilSquare className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    onClick={() => deleteTransaction(txn.id)}
                  >
                    <HiOutlineTrash className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            Showing {page * PAGE_SIZE + 1}–
            {Math.min((page + 1) * PAGE_SIZE, filtered.length)} of{" "}
            {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              <HiOutlineChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                variant={i === page ? "default" : "outline"}
                size="icon"
                className="h-8 w-8 text-xs"
                onClick={() => setPage(i)}
              >
                {i + 1}
              </Button>
            )).slice(
              Math.max(0, page - 2),
              Math.min(totalPages, page + 3)
            )}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page === totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              <HiOutlineChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      {editingTxn && (
        <EditTransactionDialog
          transaction={editingTxn}
          open={!!editingTxn}
          onClose={() => setEditingTxn(null)}
        />
      )}
    </>
  );
}
