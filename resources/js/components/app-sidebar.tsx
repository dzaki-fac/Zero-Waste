import { Link, usePage } from '@inertiajs/react';
import { Leaf, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { Auth, NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Penimbangan',
        href: '/penimbangan',
        icon: Leaf,
    },
    {
        title: 'Pilah Sampah',
        href: '/pilah-sampah',
        icon: Leaf,
    },
    {
        title: 'Distribusi',
        href: '/distribusi',
        icon: Leaf,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as { auth: Auth };

    const navItems: NavItem[] = auth.user.role === 'admin'
        ? [...mainNavItems, { title: 'Akun', href: '/admin/accounts', icon: Users }]
        : mainNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
