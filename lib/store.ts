"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Transaction, Role, FilterState, SortConfig, Category } from "./types";
import { mockTransactions } from "./data";

interface FinanceStore {
  // Data
  transactions: Transaction[];
  
  // Role
  role: Role;
  setRole: (role: Role) => void;
  
  // Theme
  theme: "dark" | "light";
  toggleTheme: () => void;
  
  // Filters
  filters: FilterState;
  setSearch: (search: string) => void;
  setCategories: (categories: Category[]) => void;
  setTypeFilter: (type: FilterState["type"]) => void;
  setDateRange: (from: string, to: string) => void;
  clearFilters: () => void;
  
  // Sorting
  sort: SortConfig;
  setSort: (field: keyof Transaction, direction: "asc" | "desc") => void;
  toggleSort: (field: keyof Transaction) => void;
  
  // CRUD
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  // Computed helpers
  getFilteredTransactions: () => Transaction[];
}

const defaultFilters: FilterState = {
  search: "",
  categories: [],
  type: "all",
  dateFrom: "",
  dateTo: "",
};

const defaultSort: SortConfig = {
  field: "date",
  direction: "desc",
};

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set, get) => ({
      transactions: mockTransactions,
      
      role: "admin",
      setRole: (role) => set({ role }),
      
      theme: "dark",
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "dark" ? "light" : "dark",
        })),
      
      filters: defaultFilters,
      setSearch: (search) =>
        set((state) => ({ filters: { ...state.filters, search } })),
      setCategories: (categories) =>
        set((state) => ({ filters: { ...state.filters, categories } })),
      setTypeFilter: (type) =>
        set((state) => ({ filters: { ...state.filters, type } })),
      setDateRange: (dateFrom, dateTo) =>
        set((state) => ({ filters: { ...state.filters, dateFrom, dateTo } })),
      clearFilters: () => set({ filters: defaultFilters }),
      
      sort: defaultSort,
      setSort: (field, direction) => set({ sort: { field, direction } }),
      toggleSort: (field) =>
        set((state) => ({
          sort: {
            field,
            direction:
              state.sort.field === field && state.sort.direction === "asc"
                ? "desc"
                : "asc",
          },
        })),
      
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            {
              ...transaction,
              id: `txn-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            },
            ...state.transactions,
          ],
        })),
      
      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
      
      getFilteredTransactions: () => {
        const { transactions, filters, sort } = get();
        let filtered = [...transactions];
        
        // Search filter
        if (filters.search) {
          const query = filters.search.toLowerCase();
          filtered = filtered.filter(
            (t) =>
              t.description.toLowerCase().includes(query) ||
              t.category.toLowerCase().includes(query)
          );
        }
        
        // Category filter
        if (filters.categories.length > 0) {
          filtered = filtered.filter((t) =>
            filters.categories.includes(t.category)
          );
        }
        
        // Type filter
        if (filters.type !== "all") {
          filtered = filtered.filter((t) => t.type === filters.type);
        }
        
        // Date range filter
        if (filters.dateFrom) {
          filtered = filtered.filter((t) => t.date >= filters.dateFrom);
        }
        if (filters.dateTo) {
          filtered = filtered.filter((t) => t.date <= filters.dateTo);
        }
        
        // Sort
        filtered.sort((a, b) => {
          const aVal = a[sort.field];
          const bVal = b[sort.field];
          const modifier = sort.direction === "asc" ? 1 : -1;
          
          if (typeof aVal === "string" && typeof bVal === "string") {
            return aVal.localeCompare(bVal) * modifier;
          }
          if (typeof aVal === "number" && typeof bVal === "number") {
            return (aVal - bVal) * modifier;
          }
          return 0;
        });
        
        return filtered;
      },
    }),
    {
      name: "zorvyn-finance-store",
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
        theme: state.theme,
      }),
    }
  )
);
