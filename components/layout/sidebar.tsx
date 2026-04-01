"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useFinanceStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
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
  {
    label: "Overview",
    href: "/dashboard",
    icon: RiDashboardLine,
  },
  {
    label: "Transactions",
    href: "/dashboard/transactions",
    icon: HiOutlineCreditCard,
  },
  {
    label: "Insights",
    href: "/dashboard/insights",
    icon: HiOutlineLightBulb,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { role, setRole, theme, toggleTheme } = useFinanceStore();

  return (
    <aside className="hidden lg:flex flex-col w-[260px] min-h-screen border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
          <HiOutlineChartPie className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-sidebar-foreground">
            Zorvyn
          </h1>
          <p className="text-[11px] text-muted-foreground font-medium -mt-0.5">
            Finance Dashboard
          </p>
        </div>
      </div>

      <Separator className="mb-2" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
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
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <item.icon className={cn("w-[18px] h-[18px]", isActive && "text-primary")} />
              {item.label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-4 pb-5 space-y-4">
        <Separator />

        {/* Role Switcher */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            {role === "admin" ? (
              <HiOutlineShieldCheck className="w-3.5 h-3.5 text-primary" />
            ) : (
              <HiOutlineUser className="w-3.5 h-3.5" />
            )}
            Role
          </label>
          <Select value={role} onValueChange={(v) => setRole(v as "admin" | "viewer")}>
            <SelectTrigger className="w-full h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">
                <span className="flex items-center gap-2">
                  <HiOutlineShieldCheck className="w-4 h-4 text-primary" />
                  Admin
                </span>
              </SelectItem>
              <SelectItem value="viewer">
                <span className="flex items-center gap-2">
                  <HiOutlineUser className="w-4 h-4" />
                  Viewer
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
          <Badge
            variant={role === "admin" ? "default" : "secondary"}
            className="text-[10px] w-fit"
          >
            {role === "admin" ? "Full Access" : "Read Only"}
          </Badge>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            {theme === "dark" ? (
              <HiOutlineMoon className="w-3.5 h-3.5" />
            ) : (
              <HiOutlineSun className="w-3.5 h-3.5" />
            )}
            {theme === "dark" ? "Dark" : "Light"}
          </label>
          <Switch
            checked={theme === "dark"}
            onCheckedChange={toggleTheme}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </div>
    </aside>
  );
}
