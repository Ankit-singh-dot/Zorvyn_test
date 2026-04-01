export type TransactionType = "income" | "expense";

export type Category =
  | "Food & Dining"
  | "Transportation"
  | "Shopping"
  | "Entertainment"
  | "Bills & Utilities"
  | "Healthcare"
  | "Salary"
  | "Freelance"
  | "Investments"
  | "Gifts"
  | "Education"
  | "Travel";

export type Role = "viewer" | "admin";

export interface Transaction {
  id: string;
  date: string; // ISO date string
  description: string;
  amount: number;
  category: Category;
  type: TransactionType;
}

export interface FilterState {
  search: string;
  categories: Category[];
  type: TransactionType | "all";
  dateFrom: string;
  dateTo: string;
}

export interface SortConfig {
  field: keyof Transaction;
  direction: "asc" | "desc";
}
