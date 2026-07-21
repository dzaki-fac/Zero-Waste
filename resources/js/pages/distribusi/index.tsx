import { Head, Link, router, usePage } from '@inertiajs/react';
import { CalendarDays, FileDown, Leaf, Plus, Trash2, Pencil, Search, MessageSquareText, CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { useState, useCallback, useMemo } from 'react';
import DistributionRevisionDialog from '@/components/distribution-revision-dialog';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { route } from 'ziggy-js';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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

type DistribusiReviewStatus = 'pending' | 'approved' | 'needs_revision' | 'rejected';

type Distribusi = {
    id: number;
    nama: string;
    tanggal: string;
    berat: string;
    jenis_sampah: string;
    tujuan_distribusi: string;
    lokasi: string;
    review_status: DistribusiReviewStatus;
    review_note: string | null;
    reviewed_at: string | null;
};

type Props = {
    distribusi: Distribusi[];
};

const statusConfig: Record<DistribusiReviewStatus, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
    pending: { label: 'Menunggu Review', className: 'bg-gray-100 text-gray-800', icon: Clock },
    approved: { label: 'Disetujui', className: 'bg-green-100 text-green-800', icon: CheckCircle2 },
    needs_revision: { label: 'Butuh Perbaikan', className: 'bg-amber-100 text-amber-800', icon: AlertTriangle },
    rejected: { label: 'Ditolak', className: 'bg-red-100 text-red-800', icon: XCircle },
};

const adminStatusClasses: Record<DistribusiReviewStatus, string> = {
    pending: 'border-gray-200 bg-gray-50 text-gray-600',
    approved: 'border-green-300 bg-green-50 text-green-800',
    needs_revision: 'border-amber-300 bg-amber-50 text-amber-800',
    rejected: 'border-red-300 bg-red-50 text-red-800',
};

const reviewOptions = [
    { value: 'approved', label: 'Setuju' },
    { value: 'needs_revision', label: 'Butuh Perbaikan' },
    { value: 'rejected', label: 'Tolak' },
];
const jenisSampahColors: Record<string, string> = {
    'Daun': 'bg-green-100 text-green-700',
    'Ranting besar': 'bg-green-100 text-green-700',
    'Ranting kecil': 'bg-green-100 text-green-700',
    'Sisa makanan': 'bg-green-100 text-green-700',
    'Plastik berwarna': 'bg-amber-100 text-amber-700',
    'Plastik putih': 'bg-blue-100 text-blue-700',
    'Styrofoam': 'bg-red-100 text-red-700',
    'Botol': 'bg-blue-100 text-blue-700',
    'Kardus dan Kertas': 'bg-amber-100 text-amber-700',
    'B3': 'bg-red-100 text-red-700',
    'Lainnya': 'bg-gray-100 text-gray-700',
};

const tujuanOptions = ['TPS', 'Pupuk/kompos', 'PlasticPay', 'Tujuan lainnya'];

const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 11 }, (_, i) => currentYear - i);

export default function DistribusiIndex({ distribusi }: Props) {
    const { auth, options } = usePage().props as unknown as { auth: Auth; options: { jenis_sampah: string[]; jenis_detail: string[]; tujuan_distribusi: string[] } };
    const role = auth.user.role;
    const isAdmin = auth.user.role === 'admin';

    const jenisSampahOptions = options.jenis_sampah;
    const jenisDetailOptions = options.jenis_detail;
    const tujuanOptions = options.tujuan_distribusi;

    const [search, setSearch] = useState('');
    const [filterJenis, setFilterJenis] = useState('all');
    const [filterTujuan, setFilterTujuan] = useState('all');
    const [filterPeriod, setFilterPeriod] = useState('all');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [weekRange, setWeekRange] = useState('7');
    const [selectedMonth, setSelectedMonth] = useState(String(new Date().getMonth() + 1));
    const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));

    const [revisionModal, setRevisionModal] = useState(false);
    const [revisionDistribusiId, setRevisionDistribusiId] = useState<number | null>(null);
    const [revisionError, setRevisionError] = useState('');
    const [revisionSubmitting, setRevisionSubmitting] = useState(false);

    const [noteModal, setNoteModal] = useState(false);
    const [noteContent, setNoteContent] = useState('');

    const matchesDate = useCallback((tanggal: string) => {
        if (filterPeriod === 'all') {
return true;
}

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
    }, [filterPeriod, weekRange, selectedMonth, selectedYear, customStartDate, customEndDate]);

    const filtered = useMemo(() => distribusi.filter((item) => {
        const matchSearch = item.nama.toLowerCase().includes(search.toLowerCase());
        const matchJenis = filterJenis === 'all' || item.jenis_sampah === filterJenis;
        const matchTujuan = filterTujuan === 'all' || item.tujuan_distribusi === filterTujuan;
        const matchDate = matchesDate(item.tanggal);

        return matchSearch && matchJenis && matchTujuan && matchDate;
    }), [distribusi, search, filterJenis, filterTujuan, matchesDate]);

    const totalWeight = filtered.reduce((sum, item) => sum + Number(item.berat), 0);
    const isEmpty = distribusi.length === 0;

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus data ini?')) {
            router.delete(route(`${role}.distribusi.destroy`, { distribusi: id }));
        }
    };

    const exportUrl = useMemo(() => {
        const params = new URLSearchParams();

        if (search) {
params.set('search', search);
}

        if (filterJenis !== 'all') {
params.set('filter_jenis', filterJenis);
}

        if (filterTujuan !== 'all') {
params.set('filter_tujuan', filterTujuan);
}

        if (filterPeriod !== 'all') {
params.set('filter_period', filterPeriod);
}

        if (filterPeriod === 'mingguan') {
params.set('week_range', weekRange);
}

        if (filterPeriod === 'bulanan') {
            params.set('month', selectedMonth);
            params.set('year', selectedYear);
        }

        if (filterPeriod === 'tahunan') {
params.set('year', selectedYear);
}

        if (filterPeriod === 'custom') {
            if (customStartDate) {
params.set('custom_start', customStartDate);
}

            if (customEndDate) {
params.set('custom_end', customEndDate);
}
        }

        const qs = params.toString();

        return `${route(`${role}.distribusi.export`)}${qs ? `?${qs}` : ''}`;
    }, [search, filterJenis, filterTujuan, filterPeriod, weekRange, selectedMonth, selectedYear, customStartDate, customEndDate, role]);

    const handleReviewChange = useCallback((id: number, status: string) => {
        if (status === 'pending') {
return;
}

        if (status === 'needs_revision') {
            setRevisionDistribusiId(id);
            setRevisionError('');
            setRevisionSubmitting(false);
            setRevisionModal(true);

            return;
        }

        router.patch(
            route(`${role}.distribusi.review`, { distribusi: id }),
            { status, note: null },
            {
                preserveScroll: true,
                onSuccess: () => router.reload({ only: ['distribusi'] }),
            },
        );
    }, [role]);

    const handleRevisionSubmit = useCallback((note: string) => {
        if (!revisionDistribusiId) {
return;
}

        setRevisionSubmitting(true);
        setRevisionError('');

        router.patch(
            route(`${role}.distribusi.review`, { distribusi: revisionDistribusiId }),
            { status: 'needs_revision', note },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setRevisionModal(false);
                    setRevisionDistribusiId(null);
                    setRevisionSubmitting(false);
                    setRevisionError('');
                    router.reload({ only: ['distribusi'] });
                },
                onError: (errors) => {
                    setRevisionSubmitting(false);
                    setRevisionError((errors as Record<string, string>).note || 'Gagal menyimpan.');
                },
            },
        );
    }, [role, revisionDistribusiId]);

    const openNoteModal = (note: string) => {
        setNoteContent(note);
        setNoteModal(true);
    };

    const canEdit = (item: Distribusi) => {
        if (isAdmin) {
return false;
}

        return item.review_status === 'needs_revision';
    };

    return (
        <>
            <Head title="Tabel Distribusi" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Tabel Distribusi"
                        description="Daftar data distribusi sampah"
                    />

                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                            <a href={exportUrl}>
                                <FileDown className="h-4 w-4" />
                                Export CSV
                            </a>
                        </Button>
                        <Button asChild className="bg-green-600 hover:bg-green-700">
                            <Link href={route(`${role}.distribusi.create`)} className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Tambah Baru
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-4 shadow-sm">
                    <div className="text-sm font-medium text-green-600">Total Berat Sampah Terdistribusi</div>
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
                            Belum ada data distribusi
                        </h3>
                        <p className="mt-1 max-w-sm text-sm text-green-600/70">
                            Mulai catat data distribusi sampah untuk membantu pengelolaan lingkungan yang lebih baik.
                        </p>
                        <Button asChild className="mt-6 bg-green-600 hover:bg-green-700">
                            <Link href={route(`${role}.distribusi.create`)} className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Tambah Distribusi
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
                            <Select value={filterTujuan} onValueChange={setFilterTujuan}>
                                <SelectTrigger className="w-full sm:w-[200px] border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20">
                                    <SelectValue placeholder="Semua Tujuan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Tujuan</SelectItem>
                                    {tujuanOptions.map((t) => (
                                        <SelectItem key={t} value={t}>{t}</SelectItem>
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
                                    <SelectItem value="harian">Hari Ini</SelectItem>
                                    <SelectItem value="mingguan">Minggu Ini</SelectItem>
                                    <SelectItem value="bulanan">Bulan Ini</SelectItem>
                                    <SelectItem value="tahunan">Tahun Ini</SelectItem>
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
                                            if (e.key !== 'Tab') {
e.preventDefault()
}
                                        }}
                                        className="w-full sm:w-[180px] pl-9 border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                                    />
                                </div>
                                <span className="hidden text-sm text-green-400 sm:inline">&mdash;</span>
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
                                            if (e.key !== 'Tab') {
e.preventDefault()
}
                                        }}
                                        className="w-full sm:w-[180px] pl-9 border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="overflow-x-auto rounded-xl border border-green-200 bg-white shadow-sm">
                            <Table className="min-w-[900px]">
                                <TableHeader>
                                    <TableRow className="border-green-100 bg-green-50/50">
                                        <TableHead className="text-green-700">No</TableHead>
                                        <TableHead className="text-green-700">Nama</TableHead>
                                        <TableHead className="text-green-700">Tanggal</TableHead>
                                        <TableHead className="text-green-700">Berat (kg)</TableHead>
                                        <TableHead className="text-green-700">Jenis</TableHead>
                                        <TableHead className="text-green-700">Tujuan</TableHead>
                                        <TableHead className="text-green-700">Lokasi</TableHead>
                                        <TableHead className="text-green-700">Status</TableHead>
                                        <TableHead className="text-right text-green-700">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={9} className="text-center text-green-600/70">
                                                Tidak ada data yang cocok.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filtered.map((item, index) => {
                                            const status = statusConfig[item.review_status] ?? statusConfig.pending;
                                            const StatusIcon = status.icon;

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
                                                            {item.jenis_sampah}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>{item.tujuan_distribusi}</TableCell>
                                                    <TableCell>{item.lokasi}</TableCell>
                                                    <TableCell>
                                                        {isAdmin ? (
                                                            <Select
                                                                value={item.review_status === 'pending' ? undefined : item.review_status}
                                                                onValueChange={(value) => handleReviewChange(item.id, value)}
                                                            >
                                                                <SelectTrigger className={`h-8 w-[160px] border text-sm font-semibold ${adminStatusClasses[item.review_status] ?? adminStatusClasses.pending}`}>
                                                                    <SelectValue placeholder="Pilih Status" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {reviewOptions.map((opt) => (
                                                                        <SelectItem key={opt.value} value={opt.value}>
                                                                            {opt.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        ) : (
                                                            <div className="flex items-center gap-1.5">
                                                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>
                                                                    <StatusIcon className="h-3 w-3" />
                                                                    {status.label}
                                                                </span>
                                                                {item.review_status === 'needs_revision' && item.review_note && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => openNoteModal(item.review_note!)}
                                                                        className="text-amber-500 hover:text-amber-700"
                                                                        title="Lihat catatan perbaikan"
                                                                    >
                                                                        <MessageSquareText className="h-4 w-4" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            {canEdit(item) && (
                                                                <Button variant="outline" size="sm" asChild className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800">
                                                                     <Link href={route(`${role}.distribusi.edit`, { distribusi: item.id })} className="flex items-center gap-1">
                                                                        <Pencil className="h-3.5 w-3.5" />
                                                                        Edit
                                                                    </Link>
                                                                </Button>
                                                            )}
                                                            {isAdmin && (
                                                                <Button
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    onClick={() => handleDelete(item.id)}
                                                                    className="flex items-center gap-1"
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                    Hapus
                                                                </Button>
                                                            )}
                                                            {!isAdmin && !canEdit(item) && (
                                                                <span className="text-xs text-gray-400">&mdash;</span>
                                                            )}
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

            <DistributionRevisionDialog
                open={revisionModal}
                processing={revisionSubmitting}
                error={revisionError}
                onOpenChange={setRevisionModal}
                onSubmit={handleRevisionSubmit}
            />

            <Dialog open={noteModal} onOpenChange={setNoteModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Catatan Perbaikan dari Admin</DialogTitle>
                    </DialogHeader>
                    <div className="rounded-lg border bg-gray-50 p-4 text-sm text-gray-700">
                        {noteContent || 'Tidak ada catatan perbaikan.'}
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setNoteModal(false)}
                            className="border-green-200 text-green-700 hover:bg-green-50"
                        >
                            Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
