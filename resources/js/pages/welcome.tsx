import { Head, Link } from '@inertiajs/react';
import { Leaf, Recycle, TreePine } from 'lucide-react';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />

            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-50 to-white p-6">
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

                    <div className="flex gap-4">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-white px-6 py-2.5 text-sm font-medium text-green-700 shadow-sm hover:bg-green-50"
                        >
                            Login
                        </Link>
                        <Link
                            href="/penimbangan"
                            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                        >
                            <Leaf className="h-4 w-4" />
                            Tabel Penimbangan
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
