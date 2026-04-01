"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useFinanceStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  HiOutlineBars3,
  HiOutlineChartPie,
  HiOutlineCreditCard,
  HiOutlineLightBulb,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineShieldCheck,
  HiOutlineUser,
} from "react-icons/hi2";
import { RiDashboardLine } from "react-icons/ri";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: RiDashboardLine },
  { label: "Transactions", href: "/dashboard/transactions", icon: HiOutlineCreditCard },
  { label: "Insights", href: "/dashboard/insights", icon: HiOutlineLightBulb },
];

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard Overview",
  "/dashboard/transactions": "Transactions",
  "/dashboard/insights": "Insights",
};

export function Header() {
  const pathname = usePathname();
  const { role, setRole, theme, toggleTheme } = useFinanceStore();

  const pageTitle = pageTitles[pathname] || "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 h-16 px-4 lg:px-6 border-b border-border bg-background/80 glass">
      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" />}>
            <HiOutlineBars3 className="w-5 h-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <div className="flex flex-col h-full">
            {/* Mobile Logo */}
            <div className="flex items-center gap-3 px-6 py-5">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
                <HiOutlineChartPie className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">Zorvyn</h1>
                <p className="text-[11px] text-muted-foreground font-medium -mt-0.5">
                  Finance Dashboard
                </p>
              </div>
            </div>

            <Separator />

            {/* Mobile Nav */}
            <nav className="flex-1 px-3 py-3 space-y-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <item.icon className="w-[18px] h-[18px]" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Bottom */}
            <div className="px-4 pb-5 space-y-4">
              <Separator />
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Role
                </label>
                <Select value={role} onValueChange={(v) => setRole(v as "admin" | "viewer")}>
                  <SelectTrigger className="w-full h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">
                  {theme === "dark" ? "Dark Mode" : "Light Mode"}
                </label>
                <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Page Title */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold tracking-tight">{pageTitle}</h2>
      </div>

      {/* Desktop Right */}
      <div className="hidden sm:flex items-center gap-3">
        <Badge
          variant={role === "admin" ? "default" : "secondary"}
          className="text-xs gap-1.5"
        >
          {role === "admin" ? (
            <HiOutlineShieldCheck className="w-3 h-3" />
          ) : (
            <HiOutlineUser className="w-3 h-3" />
          )}
          {role === "admin" ? "Admin" : "Viewer"}
        </Badge>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9 rounded-lg"
        >
          {theme === "dark" ? (
            <HiOutlineSun className="w-4 h-4" />
          ) : (
            <HiOutlineMoon className="w-4 h-4" />
          )}
        </Button>
      </div>
    </header>
  );
}
