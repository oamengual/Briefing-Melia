'use client';

import { cn } from "@/lib/utils";
import { SideNav } from "@/components/side-nav";
import { useUIStore } from "@/lib/ui-store";

export function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isSidebarCollapsed } = useUIStore();

    return (
        <div className="antialiased font-sans">
            <SideNav />
            <main
                className={cn(
                    "min-h-screen transition-all duration-300 ease-in-out",
                    isSidebarCollapsed ? "pl-[80px]" : "pl-[280px]"
                )}
            >
                <div className="w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
