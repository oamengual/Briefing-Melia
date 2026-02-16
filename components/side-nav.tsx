'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Plus,
    Settings,
    FileText,
    Home,
    LayoutTemplate,
    Menu,
    LogOut,
    Check,
    Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';
import { useUIStore } from '@/lib/ui-store';
import { useUserStore } from '@/lib/user-store';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function SideNav() {
    const pathname = usePathname();
    const { t } = useTranslation();
    const { isSidebarCollapsed, toggleSidebar } = useUIStore();
    const { currentUser, switchUser, users } = useUserStore();

    const isExpanded = !isSidebarCollapsed;

    // Role-based Navigation Visibility
    // Admin: All
    // Editor: Overview, Briefings, Templates
    // Viewers/Traffic: Overview, Briefings
    const showTemplates = ['admin', 'editor', 'design'].includes(currentUser.role);
    const showSettings = ['admin'].includes(currentUser.role);
    const canCreate = ['admin', 'editor', 'market_manager', 'content'].includes(currentUser.role);

    const links = [
        { href: '/', label: t.nav.overview, icon: Home, visible: true },

        { href: '/briefings', label: t.nav.briefings, icon: FileText, visible: true },
        { href: '/calendar', label: 'Calendar', icon: Calendar, visible: true },
        { href: '/templates', label: t.nav.templates, icon: LayoutTemplate, visible: showTemplates },
        { href: '/settings', label: t.nav.settings, icon: Settings, visible: showSettings },
    ];

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 h-screen bg-white text-muted-foreground transition-all duration-300 z-50 flex flex-col border-r border-border",
                isExpanded ? "w-[260px]" : "w-[64px]"
            )}
        >
            {/* Header / Logo */}
            <div className="h-20 flex items-center px-6 mb-4">
                <button
                    onClick={toggleSidebar}
                    className="w-8 h-8 flex items-center justify-center radius-btn hover:bg-muted text-muted-foreground transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>

                {isExpanded && (
                    <span className="ml-4 text-xl font-bold text-foreground tracking-tight">
                        briefing.
                    </span>
                )}
            </div>

            {/* Action Section */}
            {canCreate && (
                <div className="px-4 mb-8">
                    <Link href="/briefing/new">
                        <div className={cn(
                            "flex items-center transition-all duration-200",
                            "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
                            isExpanded
                                ? "h-9 px-4 radius-btn w-full gap-2 justify-center"
                                : "h-9 w-9 radius-btn justify-center mx-auto"
                        )}>
                            <Plus className="w-5 h-5 stroke-[3px]" />
                            {isExpanded && <span className="text-sm font-semibold">Create Brief</span>}
                        </div>
                    </Link>
                </div>
            )}

            {/* Navigation Destinations */}
            <nav className="flex-1 px-4 space-y-2">
                {links.filter(l => l.visible).map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center transition-all duration-200 group relative truncate outline-none",
                                "h-9 radius-btn text-sm font-medium",
                                isActive
                                    ? "bg-primary/10 text-primary font-semibold"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                isExpanded ? "px-4 gap-3" : "justify-center"
                            )}
                        >
                            <Icon className={cn(
                                "w-5 h-5 flex-shrink-0 transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                            )} />

                            {isExpanded && (
                                <span className="truncate">
                                    {link.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto border-t border-border">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className={cn(
                            "flex items-center p-2 radius-btn transition-colors hover:bg-muted cursor-pointer text-foreground outline-none",
                            isExpanded ? "gap-3" : "justify-center"
                        )}>
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center border border-border/50 text-xs shrink-0">
                                {currentUser.name.slice(0, 2).toUpperCase()}
                            </div>
                            {isExpanded && (
                                <div className="flex flex-col min-w-0 text-left">
                                    <span className="text-sm font-semibold text-foreground truncate">{currentUser.name}</span>
                                    <span className="text-xs text-muted-foreground truncate capitalize">{currentUser.role.replace('_', ' ')}</span>
                                </div>
                            )}
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[240px] mb-2">
                        <DropdownMenuLabel>Switch User (Demo)</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {users.map(user => (
                            <DropdownMenuItem
                                key={user.id}
                                onClick={() => switchUser(user.id)}
                                className="cursor-pointer"
                            >
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex flex-col">
                                        <span className="font-medium">{user.name}</span>
                                        <span className="text-xs text-muted-foreground capitalize">{user.role.replace('_', ' ')}</span>
                                    </div>
                                    {currentUser.id === user.id && <Check className="w-4 h-4 text-primary" />}
                                </div>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </aside>
    );
}

