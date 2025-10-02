"use client";

import { Home, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    title: "Properties",
    href: "/properties",
    icon: Home,
  },
  {
    title: "Owners",
    href: "/owners",
    icon: Users,
  },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo/Title */}
          <div className="flex items-center space-x-2">
            <Home className="h-6 w-6" />
            <span className="font-bold text-lg">Properties App</span>
          </div>

          {/* Navigation Links - Mobile First */}
          <div className="flex items-center space-x-1 sm:space-x-4">
            {navigationItems.map((item) => {
              const isActive = pathname?.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-1 rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
