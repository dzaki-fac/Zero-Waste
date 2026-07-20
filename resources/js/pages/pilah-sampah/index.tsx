import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { CalendarDays, FileDown, Leaf, Plus, Trash2, Pencil, Search } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { Auth } from '@/types';

type PilahSampah = {
    id: number;
    nama: string;
    tanggal: string;
    berat: string;
    jenis_sampah: string | null;
};

type Props = {
    pilahSampah: PilahSampah[];
};

const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 11 }, (_, i) => currentYear - i);

export default function PilahSampahIndex({ pilahSampah }: Props) {
    const { auth, options } = usePage().props as unknown as { auth: Auth; options: { jenis_sampah: string[]; jenis_detail: string[] } };
    const prefix = auth.user.role === 'admin' ? '/admin' : '/petugas';
    const [search, setSearch] = useState('');
    const [filterJenis, setFilterJenis] = useState('all');
    const jenisDetailOptions = options.jenis_detail;
    const [filterPeriod, setFilterPeriod] = useState('all');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [weekRange, setWeekRange] = useState('7');
    const [selectedMonth, setSelectedMonth] = useState(String(new Date().getMonth() + 1));
    const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));

    const matchesDate = (tanggal: string) => {
        if (filterPeriod === 'all') return true;
        const date = new Date(tanggal);
        const now = new Date();
        const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

        switch (filterPeriod) {
            case 'harian': {
                const start = startOfDay(now);
                const end = new Date(start);
                end.setDate(end.getDate() + 1);
                return date >= start && date < end;
            }
            case 'mingguan': {
                const days = Number(weekRange);
                const start = startOfDay(now);
                start.setDate(start.getDate() - (days - 1));
                const end = new Date(startOfDay(now));
                end.setDate(end.getDate() + 1);
                return date >= start && date < end;
            }
            case 'bulanan': {
                const start = new Date(Number(selectedYear), Number(selectedMonth) - 1, 1);
                const end = new Date(Number(selectedYear), Number(selectedMonth), 1);
                return date >= start && date < end;
            }
            case 'tahunan': {
                const start = new Date(Number(selectedYear), 0, 1);
                const end = new Date(Number(selectedYear) + 1, 0, 1);
                return date >= start && date < end;
            }
            case 'custom': {
                if (customStartDate && customEndDate) {
                    const start = new Date(customStartDate);
                    const end = new Date(customEndDate);
                    end.setDate(end.getDate() + 1);
                    return date >= start && date < end;
                }
                return true;
            }
            default:
                return true;
        }
    };

    const filtered = pilahSampah.filter((item) => {
        const type = item.jenis_sampah ?? '';
        const matchSearch = item.nama.toLowerCase().includes(search.toLowerCase());
        const matchJenis = filterJenis === 'all' || type === filterJenis;
        const matchDate = matchesDate(item.tanggal);
        return matchSearch && matchJenis && matchDate;
    });

    const totalWeight = filtered.reduce((sum, item) => sum + Number(item.berat), 0);

    const isEmpty = pilahSampah.length === 0;

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus data ini?')) {
            router.delete(`${prefix}/pilah-sampah/${id}`);
        }
    };

    return (
        <>
            <Head title="Tabel Pilah Sampah" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Tabel Pilah Sampah"
                        description="Daftar data pilah sampah"
                    />

                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                            <a href={`${prefix}/pilah-sampah/export`}>
                                <FileDown className="h-4 w-4" />
                                Export CSV
                            </a>
                        </Button>
                        <Button asChild className="bg-green-600 hover:bg-green-700">
                            <Link href={`${prefix}/pilah-sampah/create`} className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Tambah Baru
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-4 shadow-sm">
                    <div className="text-sm font-medium text-green-600">Total Berat Sampah Terpilah</div>
                    <div className="mt-1 text-2xl font-bold text-green-900">
                        {totalWeight.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                        <span className="ml-1 text-sm font-medium text-green-500">kg</span>
                    </div>
                </div>

                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-green-200 bg-green-50/50 p-16 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <Leaf className="h-8 w-8 text-green-500" />
                        </div>
                        <h3 className="mt-5 text-lg font-semibold text-green-900">
                            Belum ada data pilah sampah
                        </h3>
                        <p className="mt-1 max-w-sm text-sm text-green-600/70">
                            Mulai catat data pemilahan sampah untuk membantu pengelolaan lingkungan yang lebih baik.
                        </p>
                        <Button asChild className="mt-6 bg-green-600 hover:bg-green-700">
                            <Link href={`${prefix}/pilah-sampah/create`} className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Tambah Pilah Sampah
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-400" />
                                <Input
                                    placeholder="Cari nama..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="border-green-200 pl-9 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                                />
                            </div>
                            <Select value={filterJenis} onValueChange={setFilterJenis}>
                                <SelectTrigger className="w-full sm:w-[200px] border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20">
                                    <SelectValue placeholder="Semua Jenis" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Jenis</SelectItem>
                                    {jenisDetailOptions.map((j) => (
                                        <SelectItem key={j} value={j}>{j}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-medium text-green-700">Periode</span>
                            <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                                <SelectTrigger className="w-full sm:w-[180px] border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20">
                                    <SelectValue placeholder="Semua Waktu" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Waktu</SelectItem>
                                    <SelectItem value="harian">Harian</SelectItem>
                                    <SelectItem value="mingguan">Mingguan</SelectItem>
                                    <SelectItem value="bulanan">Bulanan</SelectItem>
                                    <SelectItem value="tahunan">Tahunan</SelectItem>
                                    <SelectItem value="custom">Custom Date</SelectItem>
                                </SelectContent>
                            </Select>
                            {filterPeriod === 'mingguan' && (
                                <Select value={weekRange} onValueChange={setWeekRange}>
                                    <SelectTrigger className="w-full sm:w-[180px] border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20">
                                        <SelectValue placeholder="7 Hari Terakhir" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="7">7 Hari Terakhir</SelectItem>
                                        <SelectItem value="14">14 Hari Terakhir</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                            {filterPeriod === 'bulanan' && (
                                <>
                                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                        <SelectTrigger className="w-full sm:w-[140px] border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20">
                                            <SelectValue placeholder="Bulan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {months.map((m, i) => (
                                                <SelectItem key={i + 1} value={String(i + 1)}>{m}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                                        <SelectTrigger className="w-full sm:w-[120px] border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20">
                                            <SelectValue placeholder="Tahun" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {years.map((y) => (
                                                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </>
                            )}
                            {filterPeriod === 'tahunan' && (
                                <Select value={selectedYear} onValueChange={setSelectedYear}>
                                    <SelectTrigger className="w-full sm:w-[120px] border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20">
                                        <SelectValue placeholder="Tahun" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map((y) => (
                                            <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                        {filterPeriod === 'custom' && (
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <div className="relative">
                                    <CalendarDays
                                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-green-400"
                                        onClick={(e) => {
                                            const input = (e.currentTarget.parentElement as HTMLElement).querySelector<HTMLInputElement>('input[type="date"]')
                                            input?.showPicker?.()
                                            input?.focus()
                                        }}
                                    />
                                    <Input
                                        type="date"
                                        value={customStartDate}
                                        onChange={(e) => setCustomStartDate(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key !== 'Tab') e.preventDefault()
                                        }}
                                        className="w-full sm:w-[180px] pl-9 border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                                    />
                                </div>
                                <span className="hidden text-sm text-green-400 sm:inline">—</span>
                                <div className="relative">
                                    <CalendarDays
                                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-green-400"
                                        onClick={(e) => {
                                            const input = (e.currentTarget.parentElement as HTMLElement).querySelector<HTMLInputElement>('input[type="date"]')
                                            input?.showPicker?.()
                                            input?.focus()
                                        }}
                                    />
                                    <Input
                                        type="date"
                                        value={customEndDate}
                                        onChange={(e) => setCustomEndDate(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key !== 'Tab') e.preventDefault()
                                        }}
                                        className="w-full sm:w-[180px] pl-9 border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="rounded-xl border border-green-200 bg-white shadow-sm">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-green-100 bg-green-50/50">
                                        <TableHead className="text-green-700">No</TableHead>
                                        <TableHead className="text-green-700">Nama</TableHead>
                                        <TableHead className="text-green-700">Tanggal</TableHead>
                                        <TableHead className="text-green-700">Berat (kg)</TableHead>
                                        <TableHead className="text-green-700">Jenis</TableHead>
                                        <TableHead className="text-right text-green-700">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center text-green-600/70">
                                                Tidak ada data yang cocok.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filtered.map((item, index) => {
                                            const type = item.jenis_sampah ?? '-';
                                            return (
                                                <TableRow key={item.id} className="border-green-100">
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell className="font-medium">{item.nama}</TableCell>
                                                    <TableCell>{new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} {new Date(item.tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</TableCell>
                                                    <TableCell className="font-medium">
                                                        {Number(item.berat).toLocaleString('id-ID', { minimumFractionDigits: 2 })} kg
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                                                            {type}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button variant="outline" size="sm" asChild className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800">
                                                                <Link href={`${prefix}/pilah-sampah/${item.id}/edit`} className="flex items-center gap-1">
                                                                    <Pencil className="h-3.5 w-3.5" />
                                                                    Edit
                                                                </Link>
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleDelete(item.id)}
                                                                className="flex items-center gap-1"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                                Hapus
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
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
