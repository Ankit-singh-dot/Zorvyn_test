import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Transaction, Category } from "./types";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), "dd MMM yyyy");
}

export function formatDateShort(dateStr: string): string {
  return format(parseISO(dateStr), "dd MMM");
}

export function getMonthYear(dateStr: string): string {
  return format(parseISO(dateStr), "MMM yyyy");
}

export function getMonthKey(dateStr: string): string {
  return format(parseISO(dateStr), "yyyy-MM");
}

export function calculatePercentChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export function getCategoryTotals(transactions: Transaction[]): Record<Category, number> {
  const totals = {} as Record<Category, number>;
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
    });
  return totals;
}

export function getHighestSpendingCategory(transactions: Transaction[]): { category: Category; amount: number } | null {
  const totals = getCategoryTotals(transactions);
  const entries = Object.entries(totals) as [Category, number][];
  if (entries.length === 0) return null;
  entries.sort((a, b) => b[1] - a[1]);
  return { category: entries[0][0], amount: entries[0][1] };
}

export function exportToCSV(transactions: Transaction[]): void {
  const headers = ["Date", "Description", "Category", "Type", "Amount"];
  const rows = transactions.map((t) => [
    t.date,
    `"${t.description}"`,
    t.category,
    t.type,
    t.amount.toString(),
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  downloadFile(csv, "transactions.csv", "text/csv");
}

export function exportToJSON(transactions: Transaction[]): void {
  const json = JSON.stringify(transactions, null, 2);
  downloadFile(json, "transactions.json", "application/json");
}

function downloadFile(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateId(): string {
  return `txn-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}
