import { Head, usePage } from '@inertiajs/react';
import { ShieldCheck, UserCog, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
    stats: {
        total_users: number;
        total_admin: number;
        total_petugas: number;
    };
    recent_users: {
        id: number;
        name: string;
        email: string;
        role: string;
        created_at: string;
    }[];
};

export default function Dashboard() {
    const { stats, recent_users } = usePage<PageProps>().props;
    const getInitials = useInitials();

    return (
        <>
            <Head title="Dashboard" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Overview sistem manajemen akun
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                                <Users className="size-6 text-emerald-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-slate-500">
                                    Total Pengguna
                                </p>
                                <p className="mt-0.5 text-2xl font-bold text-slate-900">
                                    {stats.total_users}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1 text-xs text-emerald-600">
                            <span>Semua akun terdaftar</span>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                                <ShieldCheck className="size-6 text-indigo-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-slate-500">
                                    Admin
                                </p>
                                <p className="mt-0.5 text-2xl font-bold text-slate-900">
                                    {stats.total_admin}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1 text-xs text-indigo-600">
                            <span>Akun dengan hak akses admin</span>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-sky-50">
                                <UserCog className="size-6 text-sky-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-slate-500">
                                    Petugas
                                </p>
                                <p className="mt-0.5 text-2xl font-bold text-slate-900">
                                    {stats.total_petugas}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1 text-xs text-sky-600">
                            <span>Akun petugas lapangan</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Pengguna Terbaru
                            </h2>
                            <p className="text-sm text-slate-500">
                                Akun yang baru saja dibuat
                            </p>
                        </div>
                    </div>

                    {recent_users.length > 0 ? (
                        <div className="space-y-1">
                            {recent_users.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-slate-50"
                                >
                                    <Avatar className="size-9 shrink-0">
                                        <AvatarImage
                                            src={user.email}
                                            alt={user.name}
                                        />
                                        <AvatarFallback className="bg-emerald-100 text-xs text-emerald-700">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-slate-900">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {user.email}
                                        </p>
                                    </div>
                                    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium text-slate-600">
                                        {user.role === 'admin'
                                            ? 'Admin'
                                            : 'Petugas'}
                                    </span>
                                    <span className="shrink-0 text-xs text-slate-400">
                                        {user.created_at}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="py-8 text-center text-sm text-slate-400">
                            Belum ada pengguna.
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}
