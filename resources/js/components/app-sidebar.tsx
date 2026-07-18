import { Link, usePage } from '@inertiajs/react';
import { ClipboardCheck, Database, LayoutDashboard, ListTodo, Recycle, Scale, Settings, Truck, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from '@/components/ui/sidebar';
import type { Auth, NavItem } from '@/types';

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
        { title: 'Data Dasar', href: '/admin/data-dasar', icon: Database },
        { title: 'Kelola Pekerjaan', href: '/admin/kelola-pekerjaan', icon: ListTodo },
        { title: 'Kelola Data', href: '/admin/kelola-data', icon: Settings },
        { title: 'Akun', href: '/admin/akun', icon: Users },
    ];

    const petugasNavItems: NavItem[] = [
        { title: 'Checklist Pekerjaan', href: '/petugas/checklist-pekerjaan', icon: ClipboardCheck },
    ];

    const navItems: NavItem[] = auth.user.role === 'admin'
        ? [...sharedNavItems, ...adminNavItems]
        : [...sharedNavItems, ...petugasNavItems];

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <Link
                    href="/form"
                    prefetch
                    className="grid w-full grid-cols-[120px_minmax(0,1fr)] items-center gap-2 px-4 py-4 group-data-[collapsible=icon]:grid-cols-1 group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-2"
                >
                    <AppLogo />
                </Link>
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

function portalHref(path: string): string {
    return `/${path}`;
}