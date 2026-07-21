import { Link } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};

        for (const item of items) {
            if (item.items) {
                const isAnyActive = item.items.some((sub) => isCurrentUrl(sub.href));
                initial[item.title] = isAnyActive;
            }
        }

        return initial;
    });

    function toggleMenu(title: string) {
        setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
    }

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel className="font-medium tracking-wider uppercase text-xs">
                Platform
            </SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    if (item.items) {
                        const isOpen = openMenus[item.title] ?? false;

                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    onClick={() => toggleMenu(item.title)}
                                    tooltip={{ children: item.title }}
                                    className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:shadow-sm"
                                >
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                    <ChevronDown
                                        className={cn(
                                            'ml-auto transition-transform duration-200',
                                            isOpen && 'rotate-180',
                                        )}
                                    />
                                </SidebarMenuButton>
                                {isOpen && (
                                    <SidebarMenuSub>
                                        {item.items.map((sub) => (
                                            <SidebarMenuSubItem key={sub.title}>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={isCurrentUrl(sub.href)}
                                                >
                                                    <Link href={sub.href} prefetch>
                                                        <span>{sub.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                )}
                            </SidebarMenuItem>
                        );
                    }

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isCurrentUrl(item.href!)}
                                tooltip={{ children: item.title }}
                                className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:shadow-sm"
                            >
                                <Link href={item.href!} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
