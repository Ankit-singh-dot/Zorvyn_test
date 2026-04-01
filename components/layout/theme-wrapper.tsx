"use client";

import { useEffect } from "react";
import { useFinanceStore } from "@/lib/store";

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const theme = useFinanceStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return <>{children}</>;
}
