import { Head, Link, usePage } from '@inertiajs/react';
import { Leaf, LogOut, Recycle, Scale, Truck, User } from 'lucide-react';
import LogoutButton from '@/components/logout-button';
import type { Auth } from '@/types';

export default function Welcome() {
    const { auth } = usePage().props as { auth: Auth };

    return (
        <>
            <Head title="Beranda" />

            <div className="relative flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-green-50 to-white p-6">
                <div className="absolute right-6 top-6 flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-sm font-medium text-green-700">
                        <User className="h-4 w-4" />
                        {auth.user.name}
                    </span>
                    <LogoutButton className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-white px-4 py-2.5 text-sm font-medium text-green-700 shadow-sm hover:bg-green-50">
                        <LogOut className="h-4 w-4" />
                        Logout
                    </LogoutButton>
                </div>

                <div className="flex flex-col items-center gap-8 text-center">
                    <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">
                            <Leaf className="h-7 w-7 text-green-600" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-green-900">
                            Zero Waste
                        </h1>
                    </div>

                    <p className="max-w-md text-lg text-green-700/70">
                        Selamat datang, {auth.user.name}. Silakan pilih modul operasional:
                    </p>

                    <div className="flex flex-wrap justify-center gap-3">
                        <Link
                            href="/petugas/penimbangan"
                            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                        >
                            <Scale className="h-4 w-4" />
                            Penimbangan
                        </Link>
                        <Link
                            href="/petugas/pilah-sampah"
                            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                        >
                            <Recycle className="h-4 w-4" />
                            Pilah Sampah
                        </Link>
                        <Link
                            href="/petugas/distribusi"
                            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                        >
                            <Truck className="h-4 w-4" />
                            Distribusi
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
