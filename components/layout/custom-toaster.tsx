"use client";

import { Toaster } from "sonner";
import { useFinanceStore } from "@/lib/store";

export function CustomToaster() {
  const theme = useFinanceStore((s) => s.theme);

  return (
    <Toaster
      theme={theme}
      richColors
      position="bottom-right"
      toastOptions={{
        style: {
          borderRadius: "0.75rem",
        },
      }}
    />
  );
}
