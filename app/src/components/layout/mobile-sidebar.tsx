"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, DollarSign, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "#", label: "Fundraising", icon: DollarSign, disabled: true },
  { href: "#", label: "Teams", icon: Users, disabled: true },
];

export function MobileSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="flex items-center h-16 px-6 border-b border-slate-700">
        <h1 className="text-lg font-bold text-white">Shams Foundation</h1>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-600 text-white"
                  : item.disabled
                  ? "text-slate-500 cursor-not-allowed"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
              onClick={item.disabled ? (e) => e.preventDefault() : undefined}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
              {item.disabled && (
                <span className="ml-auto text-xs text-slate-600">Soon</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
