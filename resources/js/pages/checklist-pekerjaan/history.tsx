import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, FileDown } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { route } from 'ziggy-js';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-');

    if (!y || !m || !d) {
return dateStr;
}

    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ];

    return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
};

type Record = {
    tanggal: string;
    total: number;
    selesai: number;
    belum: number;
};

type Props = {
    petugas: {
        id: number;
        name: string;
        nip: string | null;
    };
    records: Record[];
};

export default function ChecklistPekerjaanHistory({ petugas, records }: Props) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const isEmpty = records.length === 0;

    const params = () => ({
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate }),
    });

    const applyFilter = () => {
        router.get(
            route('admin.checklist-pekerjaan.history', { petugas: petugas.nip }),
            params(),
            { preserveState: true, preserveScroll: true },
        );
    };

    const hasFilters = startDate || endDate;

    return (
        <>
            <Head title={`Riwayat - ${petugas.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title={`Riwayat Checklist - ${petugas.name}`}
                        description={`NIP: ${petugas.nip ?? '-'}`}
                    />
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild className="border-green-200 text-green-700 hover:bg-green-50">
                            <Link href={route('admin.checklist-pekerjaan.index')} className="flex items-center gap-1">
                                <ArrowLeft className="h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>
                    </div>
                </div>

                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-green-200 bg-green-50/50 p-16 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <FileDown className="h-8 w-8 text-green-500" />
                        </div>
                        <h3 className="mt-5 text-lg font-semibold text-green-900">
                            Belum ada riwayat
                        </h3>
                        <p className="mt-1 max-w-sm text-sm text-green-600/70">
                            Petugas ini belum memiliki data checklist yang tersimpan.
                        </p>
                        <Button asChild className="mt-6 bg-green-600 hover:bg-green-700">
                            <Link
                                href={route('admin.checklist-pekerjaan.show', { checklist_pekerjaan: petugas.nip })}
                                className="flex items-center gap-2"
                            >
                                Buat Checklist Baru
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-wrap items-end gap-3">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-green-700" htmlFor="filter-start">Dari Tanggal</label>
                                <div
                                    className="relative cursor-pointer"
                                    onClick={(e) => {
                                        const el = e.currentTarget.querySelector<HTMLInputElement>('input[type="date"]');
                                        el?.showPicker();
                                    }}
                                >
                                    <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-400 pointer-events-none" />
                                    <input
                                        id="filter-start"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        onFocus={(e) => e.target.showPicker()}
                                        onKeyDown={(e) => e.key !== 'Tab' && e.preventDefault()}
                                        onPaste={(e) => e.preventDefault()}
                                        onDrop={(e) => e.preventDefault()}
                                        className="flex h-9 w-full min-w-0 rounded-md border border-green-200 bg-transparent px-3 py-1 pl-9 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-green-500 focus-visible:ring-[3px] focus-visible:ring-green-500/20 md:text-sm"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-green-700" htmlFor="filter-end">Sampai Tanggal</label>
                                <div
                                    className="relative cursor-pointer"
                                    onClick={(e) => {
                                        const el = e.currentTarget.querySelector<HTMLInputElement>('input[type="date"]');
                                        el?.showPicker();
                                    }}
                                >
                                    <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-400 pointer-events-none" />
                                    <input
                                        id="filter-end"
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        onFocus={(e) => e.target.showPicker()}
                                        onKeyDown={(e) => e.key !== 'Tab' && e.preventDefault()}
                                        onPaste={(e) => e.preventDefault()}
                                        onDrop={(e) => e.preventDefault()}
                                        className="flex h-9 w-full min-w-0 rounded-md border border-green-200 bg-transparent px-3 py-1 pl-9 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-green-500 focus-visible:ring-[3px] focus-visible:ring-green-500/20 md:text-sm"
                                    />
                                </div>
                            </div>
                            <Button onClick={applyFilter} className="bg-green-600 hover:bg-green-700">
                                Filter
                            </Button>
                            {hasFilters && (
                                <Button
                                    variant="outline"
                                    asChild
                                    className="border-green-200 text-green-700 hover:bg-green-50"
                                >
                                    <Link
                                        href={route('admin.checklist-pekerjaan.history', { petugas: petugas.nip })}
                                        className="flex items-center gap-1"
                                    >
                                        Reset
                                    </Link>
                                </Button>
                            )}
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-green-200 bg-white shadow-sm">
                            <Table className="min-w-[400px]">
                                <TableHeader>
                                    <TableRow className="border-green-100 bg-green-50/50">
                                        <TableHead className="text-green-700">No</TableHead>
                                        <TableHead className="text-green-700">Tanggal</TableHead>
                                        <TableHead className="text-green-700">Total Tugas</TableHead>
                                        <TableHead className="text-green-700">Selesai</TableHead>
                                        <TableHead className="text-green-700">Belum</TableHead>
                                        <TableHead className="text-right text-green-700">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {records.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="text-center text-green-600/70"
                                            >
                                                Tidak ada data yang cocok.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        records.map((r, index) => (
                                            <TableRow key={r.tanggal} className="border-green-100">
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell className="font-medium">
                                                    {formatDate(r.tanggal)}
                                                </TableCell>
                                                <TableCell>{r.total}</TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                                                        {r.selesai}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                                                        {r.belum}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        asChild
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        <Link
                                                            href={route('admin.checklist-pekerjaan.show', { checklist_pekerjaan: petugas.nip, tanggal: r.tanggal })}
                                                        >
                                                            Detail
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
