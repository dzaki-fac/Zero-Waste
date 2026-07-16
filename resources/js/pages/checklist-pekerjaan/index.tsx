import { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ClipboardCheck, ClipboardList, Download, History, FileDown, Search, X } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type Petugas = {
    id: number;
    name: string;
    nip: string | null;
};

type Props = {
    petugas: Petugas[];
};

export default function ChecklistPekerjaanIndex({ petugas }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [exportingNip, setExportingNip] = useState<string | null>(null);
    const isEmpty = petugas.length === 0;

    const query = searchQuery.trim().toLowerCase();
    const filteredPetugas = useMemo(() => {
        if (!query) return petugas;
        return petugas.filter(
            (p) =>
                p.name.toLowerCase().includes(query) ||
                (p.nip && p.nip.toLowerCase().includes(query)),
        );
    }, [petugas, query]);

    const searchEmpty = !isEmpty && query && filteredPetugas.length === 0;

    const handleExport = (nip: string) => {
        if (exportingNip === nip) return;
        setExportingNip(nip);
        const a = document.createElement('a');
        a.href = `/admin/checklist-pekerjaan/export?nip=${nip}`;
        a.download = '';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => setExportingNip(null), 3000);
    };

    return (
        <>
            <Head title="Checklist Pekerjaan" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Checklist Pekerjaan"
                        description="Daftar petugas kebersihan"
                    />
                </div>

                {!isEmpty && (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-400" />
                            <input
                                id="search-petugas"
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari berdasarkan nama atau NIP..."
                                className="flex h-10 w-full min-w-0 rounded-md border border-green-200 bg-white px-3 py-1 pl-9 pr-9 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-green-500 focus-visible:ring-[3px] focus-visible:ring-green-500/20"
                                aria-label="Cari petugas"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-green-400 hover:text-green-600 transition-colors"
                                    aria-label="Hapus pencarian"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        <a
                            href="/admin/checklist-pekerjaan/export-all"
                            download
                            className="inline-flex shrink-0 items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                        >
                            <FileDown className="h-4 w-4" />
                            Ekspor Semua Data
                        </a>
                    </div>
                )}

                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-green-200 bg-green-50/50 p-16 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <ClipboardList className="h-8 w-8 text-green-500" />
                        </div>
                        <h3 className="mt-5 text-lg font-semibold text-green-900">
                            Belum ada petugas
                        </h3>
                        <p className="mt-1 max-w-sm text-sm text-green-600/70">
                            Belum terdapat akun petugas yang terdaftar.
                        </p>
                    </div>
                ) : searchEmpty ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-green-200 bg-green-50/50 p-16 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <Search className="h-8 w-8 text-green-500" />
                        </div>
                        <h3 className="mt-5 text-lg font-semibold text-green-900">
                            Petugas tidak ditemukan.
                        </h3>
                        <p className="mt-1 max-w-sm text-sm text-green-600/70">
                            Coba gunakan nama atau NIP yang berbeda.
                        </p>
                    </div>
                ) : (
                    <div className="rounded-xl border border-green-200 bg-white shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-green-100 bg-green-50/50">
                                    <TableHead className="text-green-700">No</TableHead>
                                    <TableHead className="text-green-700">Nama</TableHead>
                                    <TableHead className="text-green-700">NIP</TableHead>
                                    <TableHead className="text-right text-green-700">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPetugas.map((item, index) => (
                                    <TableRow key={item.id} className="border-green-100">
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell>{item.nip ?? '-'}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button asChild className="bg-green-600 hover:bg-green-700">
                                                    <Link
                                                        href={`/admin/checklist-pekerjaan/${item.nip}`}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <ClipboardCheck className="h-4 w-4" />
                                                        Checklist
                                                    </Link>
                                                </Button>
                                                <Button variant="outline" asChild className="border-green-200 text-green-700 hover:bg-green-50">
                                                    <Link
                                                        href={`/admin/checklist-pekerjaan/${item.nip}/history`}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <History className="h-4 w-4" />
                                                        Riwayat
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    disabled={exportingNip === item.nip}
                                                    onClick={() => handleExport(item.nip!)}
                                                    className="border-green-200 text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Download className={`h-4 w-4 ${exportingNip === item.nip ? 'animate-pulse' : ''}`} />
                                                    {exportingNip === item.nip ? 'Mengunduh...' : 'Ekspor Data'}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </>
    );
}
