import { Link, router, usePage } from '@inertiajs/react';
import { LayoutDashboard, LogOut, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import type { Auth } from '@/types';

const appName = import.meta.env.VITE_APP_NAME || 'Zero Waste';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { url } = usePage();
    const { auth } = usePage<{ auth: Auth }>().props;
    const getInitials = useInitials();
    const [mobileOpen, setMobileOpen] = useState(false);
    const isAdmin = auth.user?.role === 'admin';

    const isActive = (path: string) => {
        if (path === '/admin/dashboard') {
            return url === '/admin/dashboard';
        }
        return url.startsWith(path);
    };

    const sidebar = (
        <div className="flex h-full flex-col bg-emerald-900 text-white">
            <div className="flex h-16 items-center gap-3 border-b border-emerald-800 px-5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-600">
                    <LayoutDashboard className="size-5 text-white" />
                </div>
                <span className="text-base font-bold tracking-tight">
                    {appName}
                </span>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-6">
                <Link
                    href="/admin/dashboard"
                    className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive('/admin/dashboard')
                            ? 'bg-emerald-700 text-white shadow-sm'
                            : 'text-emerald-200 hover:bg-emerald-800 hover:text-white',
                    )}
                    onClick={() => setMobileOpen(false)}
                >
                    <LayoutDashboard className="size-5 shrink-0" />
                    <span>Dashboard</span>
                </Link>

                {isAdmin && (
                    <Link
                        href="/admin/accounts"
                        className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                            isActive('/admin/accounts')
                                ? 'bg-emerald-700 text-white shadow-sm'
                                : 'text-emerald-200 hover:bg-emerald-800 hover:text-white',
                        )}
                        onClick={() => setMobileOpen(false)}
                    >
                        <ShieldCheck className="size-5 shrink-0" />
                        <span>Akun</span>
                    </Link>
                )}
            </nav>

            <div className="border-t border-emerald-800 px-3 py-3">
                <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
                    <Avatar className="size-8 shrink-0">
                        <AvatarImage
                            src={auth.user?.avatar}
                            alt={auth.user?.name}
                        />
                        <AvatarFallback className="bg-emerald-600 text-xs text-white">
                            {auth.user ? getInitials(auth.user.name) : '?'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">
                            {auth.user?.name}
                        </p>
                        <p className="truncate text-xs text-emerald-300">
                            {auth.user?.role === 'admin'
                                ? 'Admin'
                                : 'Petugas'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => router.post('/logout')}
                        className="flex size-8 shrink-0 items-center justify-center rounded-lg text-emerald-400 transition-colors hover:bg-emerald-800 hover:text-white"
                        title="Keluar"
                    >
                        <LogOut className="size-4" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen overflow-hidden bg-stone-50">
            <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
                {sidebar}
            </aside>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetContent
                    side="left"
                    className="w-64 p-0 [&>button]:hidden"
                >
                    <SheetHeader className="sr-only">
                        <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    {sidebar}
                </SheetContent>
            </Sheet>

            <div className="flex flex-1 flex-col min-w-0 md:ml-64">
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-emerald-200 bg-white px-4 md:px-6">
                    <button
                        type="button"
                        className="md:hidden"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Toggle sidebar"
                    >
                        <LayoutDashboard className="size-5 text-emerald-600" />
                    </button>

                    <div className="flex items-center gap-3 ml-auto">
                        <div className="text-right">
                            <p className="text-sm font-medium text-emerald-900">
                                {auth.user?.name}
                            </p>
                            <p className="text-xs font-medium text-emerald-600">
                                {auth.user?.role === 'admin'
                                    ? 'Admin'
                                    : 'Petugas'}
                            </p>
                        </div>
                        <Avatar className="size-8">
                            <AvatarImage
                                src={auth.user?.avatar}
                                alt={auth.user?.name}
                            />
                            <AvatarFallback className="bg-emerald-100 text-xs text-emerald-700">
                                {auth.user
                                    ? getInitials(auth.user.name)
                                    : '?'}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
