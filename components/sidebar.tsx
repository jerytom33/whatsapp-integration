"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    MessageSquare,
    Settings,
    FileText,
    Activity,
    ShoppingBag,
    Workflow,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    // Helper to check if link is active.
    // We check if pathname starts with the link path (for sub-routes) or is exact match.
    const isActive = (path: string) => {
        if (path === "/dashboard" && pathname === "/dashboard") return true;
        if (path !== "/dashboard" && pathname.startsWith(path)) return true;
        return false;
    };

    const navItems = [
        { href: "/inbox", label: "Inbox", icon: MessageSquare },
        { href: "/messaging", label: "Messaging", icon: LayoutDashboard },
        { href: "/templates", label: "Templates", icon: FileText },
        { href: "/webhooks", label: "Logs", icon: Activity },
        { href: "/shopify", label: "Shopify", icon: ShoppingBag },
        { href: "/dashboard", label: "Workflows", icon: Workflow }, // Mapped to existing /dashboard
        { href: "/settings", label: "Settings", icon: Settings },
    ];

    return (
        <aside
            className={cn(
                "relative flex flex-col border-r bg-card transition-all duration-300",
                collapsed ? "w-[60px]" : "w-[260px]"
            )}
        >
            <div className={cn("flex items-center justify-between p-4 h-16 border-b", collapsed && "justify-center p-2")}>
                {!collapsed && (
                    <div className="flex items-center gap-2 font-bold text-xl text-primary truncate">
                        <MessageSquare className="h-6 w-6" />
                        <span>WA Bridge</span>
                    </div>
                )}
                {collapsed && <MessageSquare className="h-6 w-6 text-primary" />}
            </div>

            <div className="absolute right-[-12px] top-6 z-10 hidden md:block">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6 rounded-full shadow-md bg-background"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
                </Button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-2">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    isActive(item.href)
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                    collapsed && "justify-center px-2"
                                )}
                                title={collapsed ? item.label : undefined}
                            >
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
