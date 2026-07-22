import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ClipboardCheck,
    LayoutDashboard,
    LogOut,
    Recycle,
    Scale,
    TreePine,
    Truck,
    User,
} from 'lucide-react';

type AuthUser = {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'petugas';
};

type WelcomePageProps = {
    auth: {
        user: AuthUser | null;
    };
};

export default function Welcome() {
    const { auth } = usePage<WelcomePageProps>().props;

    const handleLogout = (): void => {
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

            <main className="relative flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-green-50 to-white px-6 py-24">
                {/* Header actions */}
                <div className="absolute right-4 top-4 flex flex-wrap items-center justify-end gap-2 sm:right-6 sm:top-6 sm:gap-3">
                    {auth.user ? (
                        <>
                            <span className="flex items-center gap-1.5 text-sm font-medium text-green-700">
                                <User className="h-4 w-4" />
                                {auth.user.name}
                            </span>

                            {dashboardRoute && (
                                <Link
                                    href={dashboardRoute}
                                    className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-white px-4 py-2.5 text-sm font-medium text-green-700 shadow-sm transition hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboard
                                </Link>
                            )}

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-white px-4 py-2.5 text-sm font-medium text-green-700 shadow-sm transition hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                            >
                                <LogOut className="h-4 w-4" />
                                Keluar
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-white px-6 py-2.5 text-sm font-medium text-green-700 shadow-sm transition hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                        >
                            Login
                        </Link>
                    )}
                </div>

                {/* Main content */}
                <section className="flex w-full max-w-4xl flex-col items-center gap-5 text-center">
                    {/* Logo area */}
                    <Link
                        href="/form"
                        aria-label="Open ZeroLib form page"
                        className="flex h-24 sm:h-28 w-full max-w-[280px] sm:max-w-[320px] items-center justify-center overflow-hidden bg-transparent transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                    >
                    <img
                src="/images/zerolib-logo.png"
                alt="ZeroLib"
                className="h-auto w-full max-w-[260px] sm:max-w-[300px] object-contain object-center"
                loading="eager"
                draggable={false}
            />
                    </Link>

                    {/* Description */}
                    <p className="max-w-md text-lg leading-relaxed text-green-800">
                        Sistem pengelolaan sampah untuk lingkungan yang lebih
                        bersih dan berkelanjutan.
                    </p>

                    {/* Badges */}
                    <div className="flex flex-wrap justify-center gap-3">
                        <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm text-green-700">
                            <Recycle className="h-4 w-4" />
                            <span>Daur Ulang</span>
                        </div>

                        <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm text-green-700">
                            <TreePine className="h-4 w-4" />
                            <span>Lestari</span>
                        </div>
                    </div>

                    {/* Operational modules */}
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link
                            href="/form/pekerjaan"
                            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                        >
                            <ClipboardCheck className="h-4 w-4" />
                            Checklist Pekerjaan
                        </Link>

                        <Link
                            href="/form/penimbangan"
                            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                        >
                            <Scale className="h-4 w-4" />
                            Penimbangan
                        </Link>

                        <Link
                            href="/form/pilah-sampah"
                            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                        >
                            <Recycle className="h-4 w-4" />
                            Pilah Sampah
                        </Link>

                        <Link
                            href="/form/distribusi"
                            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                        >
                            <Truck className="h-4 w-4" />
                            Distribusi
                        </Link>
                    </div>
                </section>
            </main>
        </>
    );
}