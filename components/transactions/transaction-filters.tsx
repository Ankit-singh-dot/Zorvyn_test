"use client";

import { useFinanceStore } from "@/lib/store";
import { CATEGORIES } from "@/lib/data";
import { Category } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
  HiOutlineFunnel,
} from "react-icons/hi2";

export function TransactionFilters() {
  const { filters, setSearch, setTypeFilter, setCategories, setDateRange, clearFilters } =
    useFinanceStore();

  const activeFilterCount =
    (filters.search ? 1 : 0) +
    (filters.type !== "all" ? 1 : 0) +
    (filters.categories.length > 0 ? 1 : 0) +
    (filters.dateFrom || filters.dateTo ? 1 : 0);

  const handleCategoryToggle = (cat: Category) => {
    if (filters.categories.includes(cat)) {
      setCategories(filters.categories.filter((c) => c !== cat));
    } else {
      setCategories([...filters.categories, cat]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        {/* Type Filter */}
        <Select
          value={filters.type}
          onValueChange={(v) => setTypeFilter(v as "all" | "income" | "expense")}
        >
          <SelectTrigger className="w-full sm:w-[150px] h-10">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>

        {/* Date From */}
        <Input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => setDateRange(e.target.value, filters.dateTo)}
          className="w-full sm:w-[150px] h-10"
          placeholder="From"
        />

        {/* Date To */}
        <Input
          type="date"
          value={filters.dateTo}
          onChange={(e) => setDateRange(filters.dateFrom, e.target.value)}
          className="w-full sm:w-[150px] h-10"
          placeholder="To"
        />

        {/* Clear */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-10 gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <HiOutlineXMark className="w-4 h-4" />
            Clear
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
              {activeFilterCount}
            </Badge>
          </Button>
        )}
      </div>

      {/* Category Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <HiOutlineFunnel className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        {CATEGORIES.map((cat) => {
          const isActive = filters.categories.includes(cat);
          return (
            <button
              key={cat}
              onClick={() => handleCategoryToggle(cat)}
              className={`
                text-xs px-2.5 py-1 rounded-full border transition-all duration-200
                ${
                  isActive
                    ? "bg-primary/10 border-primary/30 text-primary font-medium"
                    : "border-border text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
                }
              `}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
