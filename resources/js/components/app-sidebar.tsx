import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, ListTodo, Recycle, Scale, Settings, Truck, Users } from 'lucide-react';
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

function portalHref(path: string): string {
    return `/${path}`;
}

export function AppSidebar() {
    const { auth } = usePage().props as { auth: Auth };

    const prefix = auth.user.role === 'admin' ? 'admin' : 'petugas';

    const sharedNavItems: NavItem[] = [
        { title: 'Dashboard', href: `/${prefix}/dashboard`, icon: LayoutDashboard },
        { title: 'Penimbangan', href: `/${prefix}/penimbangan`, icon: Scale },
        { title: 'Pilah Sampah', href: `/${prefix}/pilah-sampah`, icon: Recycle },
        { title: 'Distribusi', href: `/${prefix}/distribusi`, icon: Truck },
    ];

    const adminNavItems: NavItem[] = [
        { title: 'Checklist Pekerjaan', href: '/admin/checklist-pekerjaan', icon: LayoutDashboard },
        { title: 'Kelola Pekerjaan', href: '/admin/kelola-pekerjaan', icon: ListTodo },
        { title: 'Kelola Data', href: '/admin/kelola-data', icon: Settings },
        { title: 'Akun', href: '/admin/akun', icon: Users },
    ];

    const navItems: NavItem[] = auth.user.role === 'admin'
        ? [...sharedNavItems, ...adminNavItems]
        : sharedNavItems;

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={auth.user.role === 'petugas' ? '/form' : '/admin/dashboard'} prefetch>
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