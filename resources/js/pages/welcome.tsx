import { Head, Link, usePage, router } from '@inertiajs/react';
import { LayoutDashboard, Leaf, LogOut, Recycle, TreePine, User } from 'lucide-react';

type AuthUser = { id: number; name: string; email: string; role: 'admin' | 'petugas' };

export default function Welcome() {
    const { auth } = usePage().props as { auth: { user: AuthUser | null } };

    const handleLogout = () => {
        router.post('/logout');
    };

    const dashboardRoute =
        auth.user?.role === 'admin'
            ? '/admin/dashboard'
            : auth.user?.role === 'petugas'
              ? '/petugas/dashboard'
              : null;

    return (
        <>
            <Head title="Welcome" />

            <div className="relative flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-green-50 to-white p-6">
                <div className="absolute right-6 top-6 flex items-center gap-3">
                    {auth.user ? (
                        <>
                            <span className="flex items-center gap-1.5 text-sm font-medium text-green-700">
                                <User className="h-4 w-4" />
                                {auth.user.name}
                            </span>
                            {dashboardRoute && (
                                <Link
                                    href={dashboardRoute}
                                    className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-white px-4 py-2.5 text-sm font-medium text-green-700 shadow-sm hover:bg-green-50"
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboard
                                </Link>
                            )}
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-white px-4 py-2.5 text-sm font-medium text-green-700 shadow-sm hover:bg-green-50"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-white px-6 py-2.5 text-sm font-medium text-green-700 shadow-sm hover:bg-green-50"
                        >
                            Login
                        </Link>
                    )}
                </div>

                <div className="flex flex-col items-center gap-8 text-center">
                    <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">
                            <Leaf className="h-7 w-7 text-green-600" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-green-900">
                            ZeroLib
                        </h1>
                    </div>

                    <p className="max-w-md text-lg text-green-700/70">
                        Sistem pengelolaan sampah untuk lingkungan yang lebih bersih dan berkelanjutan.
                    </p>

                    <div className="flex gap-3">
                        <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm text-green-700">
                            <Recycle className="h-4 w-4" />
                            <span>Daur Ulang</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm text-green-700">
                            <TreePine className="h-4 w-4" />
                            <span>Lestari</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3">
                        <Link
                            href="/form/penimbangan"
                            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                        >
                            <Leaf className="h-4 w-4" />
                            Penimbangan
                        </Link>
                        <Link
                            href="/form/pilah-sampah"
                            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                        >
                            <Leaf className="h-4 w-4" />
                            Pilah Sampah
                        </Link>
                        <Link
                            href="/form/distribusi"
                            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                        >
                            <Leaf className="h-4 w-4" />
                            Distribusi
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}