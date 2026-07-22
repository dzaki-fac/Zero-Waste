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
import { route } from 'ziggy-js';

export function AppSidebar() {
    const { auth } = usePage().props as { auth: Auth };

    const isAdmin = auth.user.role === 'admin';
    const prefix = isAdmin ? 'admin' : 'petugas';

    const sharedNavItems: NavItem[] = [
        { title: 'Dashboard', href: route(isAdmin ? 'admin.dashboard' : 'petugas.dashboard'), icon: LayoutDashboard },
        { title: 'Penimbangan', href: route(isAdmin ? 'admin.penimbangan.index' : 'petugas.penimbangan.index'), icon: Scale },
        { title: 'Pilah Sampah', href: route(isAdmin ? 'admin.pilah-sampah.index' : 'petugas.pilah-sampah.index'), icon: Recycle },
        { title: 'Distribusi', href: route(isAdmin ? 'admin.distribusi.index' : 'petugas.distribusi.index'), icon: Truck },
    ];

    const adminNavItems: NavItem[] = [
        { title: 'Checklist Pekerjaan', href: route('admin.checklist-pekerjaan.index'), icon: LayoutDashboard },
        { title: 'Kelola Pekerjaan', href: route('admin.kelola-pekerjaan.index'), icon: ListTodo },
        {
            title: 'Kelola Website',
            icon: Globe,
            items: [
                { title: 'Peraturan', href: route('admin.dokumen.index') },
                { title: 'Struktur', href: route('admin.dokumen.index') },
                { title: 'SOP', href: route('admin.dokumen.index') },
                { title: 'Berita', href: route('admin.berita.index') },
                { title: 'Poster Edukasi', href: route('admin.poster.index') },
            ],
        },
        { title: 'Data Dasar', href: route('admin.data-dasar.index'), icon: Database },
        { title: 'Kelola Data', href: route('settings.index'), icon: Settings },
        { title: 'Akun', href: route('admin.accounts.index'), icon: Users },
    ];

    const petugasNavItems: NavItem[] = [
        { title: 'Checklist Pekerjaan', href: route('petugas.checklist-pekerjaan.index'), icon: ClipboardCheck },
    ];

    const navItems: NavItem[] = auth.user.role === 'admin'
        ? [...sharedNavItems, ...adminNavItems]
        : [...sharedNavItems, ...petugasNavItems];

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                    <Link
                        href={route('form')}
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

