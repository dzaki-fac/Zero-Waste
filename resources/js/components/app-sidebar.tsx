import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Recycle, Scale, Truck, Users } from 'lucide-react';
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
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Penimbangan',
        href: '/admin/penimbangan',
        icon: Scale,
    },
    {
        title: 'Pilah Sampah',
        href: '/admin/pilah-sampah',
        icon: Recycle,
    },
    {
        title: 'Distribusi',
        href: '/admin/distribusi',
        icon: Truck,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as { auth: Auth };

    const navItems: NavItem[] = auth.user.role === 'admin'
        ? [...mainNavItems, { title: 'Akun', href: '/admin/accounts', icon: Users }]
        : mainNavItems;

    return (
        <Sidebar collapsible="icon">
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
