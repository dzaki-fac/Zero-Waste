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

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight">
                        Dashboard
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Overview sistem manajemen akun
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-xl border border-green-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-green-100">
                                <Users className="size-6 text-green-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-green-600">
                                    Total Pengguna
                                </p>
                                <p className="mt-0.5 text-2xl font-bold text-green-900">
                                    {stats.total_users}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-green-600/70">
                            Semua akun terdaftar
                        </div>
                    </div>

                    <div className="rounded-xl border border-green-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-green-100">
                                <ShieldCheck className="size-6 text-green-700" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-green-600">
                                    Admin
                                </p>
                                <p className="mt-0.5 text-2xl font-bold text-green-900">
                                    {stats.total_admin}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-green-600/70">
                            Akun dengan hak akses admin
                        </div>
                    </div>

                    <div className="rounded-xl border border-green-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-green-100">
                                <UserCog className="size-6 text-green-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-green-600">
                                    Petugas
                                </p>
                                <p className="mt-0.5 text-2xl font-bold text-green-900">
                                    {stats.total_petugas}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-green-600/70">
                            Akun petugas lapangan
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-green-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-green-900">
                                Pengguna Terbaru
                            </h2>
                            <p className="text-sm text-green-600/70">
                                Akun yang baru saja dibuat
                            </p>
                        </div>
                    </div>

                    {recent_users.length > 0 ? (
                        <div className="space-y-1">
                            {recent_users.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-green-50"
                                >
                                    <Avatar className="size-9 shrink-0">
                                        <AvatarImage
                                            src={user.email}
                                            alt={user.name}
                                        />
                                        <AvatarFallback className="bg-green-100 text-xs text-green-700">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-green-900">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-green-600/70">
                                            {user.email}
                                        </p>
                                    </div>
                                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                                        {user.role === 'admin'
                                            ? 'Admin'
                                            : 'Petugas'}
                                    </span>
                                    <span className="shrink-0 text-xs text-green-400">
                                        {user.created_at}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="py-8 text-center text-sm text-green-400">
                            Belum ada pengguna.
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}
