import { Link, usePage } from '@inertiajs/react';
import { ClipboardCheck, Database, Globe, LayoutDashboard, ListTodo, Recycle, Scale, Settings, Truck, Users } from 'lucide-react';
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
import { baseUrl } from '@/lib/path';

export function AppSidebar() {
    const { auth } = usePage().props as { auth: Auth };

    const prefix = auth.user.role === 'admin' ? 'admin' : 'petugas';

    const sharedNavItems: NavItem[] = [
        { title: 'Dashboard', href: baseUrl(`/${prefix}/dashboard`), icon: LayoutDashboard },
        { title: 'Penimbangan', href: baseUrl(`/${prefix}/penimbangan`), icon: Scale },
        { title: 'Pilah Sampah', href: baseUrl(`/${prefix}/pilah-sampah`), icon: Recycle },
        { title: 'Distribusi', href: baseUrl(`/${prefix}/distribusi`), icon: Truck },
    ];

    const adminNavItems: NavItem[] = [
        { title: 'Checklist Pekerjaan', href: baseUrl('/admin/checklist-pekerjaan'), icon: LayoutDashboard },
        { title: 'Kelola Pekerjaan', href: baseUrl('/admin/kelola-pekerjaan'), icon: ListTodo },
        {
            title: 'Kelola Website',
            icon: Globe,
            items: [
                { title: 'Peraturan', href: baseUrl('/admin/dokumen') },
                { title: 'Struktur', href: baseUrl('/admin/dokumen') },
                { title: 'SOP', href: baseUrl('/admin/dokumen') },
                { title: 'Berita', href: baseUrl('/admin/berita') },
                { title: 'Poster Edukasi', href: baseUrl('/admin/poster') },
            ],
        },
        { title: 'Data Dasar', href: baseUrl('/admin/data-dasar'), icon: Database },
        { title: 'Kelola Data', href: baseUrl('/admin/kelola-data'), icon: Settings },
        { title: 'Akun', href: baseUrl('/admin/akun'), icon: Users },
    ];

    const petugasNavItems: NavItem[] = [
        { title: 'Checklist Pekerjaan', href: baseUrl('/petugas/checklist-pekerjaan'), icon: ClipboardCheck },
    ];

    const navItems: NavItem[] = auth.user.role === 'admin'
        ? [...sharedNavItems, ...adminNavItems]
        : [...sharedNavItems, ...petugasNavItems];

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <Link
                    href={baseUrl('/form')}
                    prefetch
                    className="grid w-full items-center px-4 py-4 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-2"
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
    return baseUrl(`/${path}`);
}
