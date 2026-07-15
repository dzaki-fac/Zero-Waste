import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Leaf, Plus, Trash2, Pencil, Search } from 'lucide-react';
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

type Distribusi = {
    id: number;
    nama: string;
    tanggal: string;
    berat: string;
    jenis_sampah: string;
    tujuan_distribusi: string;
    lokasi: string;
};

type Props = {
    distribusi: Distribusi[];
};

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

const jenisSampahOptions = Object.keys(jenisSampahColors);
const tujuanOptions = ['TPS', 'Pupuk/kompos', 'PlasticPay', 'Tujuan lainnya'];

export default function DistribusiIndex({ distribusi }: Props) {
    const [search, setSearch] = useState('');
    const [filterJenis, setFilterJenis] = useState('all');
    const [filterTujuan, setFilterTujuan] = useState('all');

    const filtered = distribusi.filter((item) => {
        const matchSearch = item.nama.toLowerCase().includes(search.toLowerCase());
        const matchJenis = filterJenis === 'all' || item.jenis_sampah === filterJenis;
        const matchTujuan = filterTujuan === 'all' || item.tujuan_distribusi === filterTujuan;
        return matchSearch && matchJenis && matchTujuan;
    });

    const isEmpty = distribusi.length === 0;

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus data ini?')) {
            router.delete(`/distribusi/${id}`);
        }
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

                    <Button asChild className="bg-green-600 hover:bg-green-700">
                        <Link href="/distribusi/create" className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Tambah Baru
                        </Link>
                    </Button>
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
                            <Link href="/distribusi/create" className="flex items-center gap-2">
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
                                    <SelectItem value="all">Semua Jenis Sampah</SelectItem>
                                    {jenisSampahOptions.map((j) => (
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

                        <div className="rounded-xl border border-green-200 bg-white shadow-sm">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-green-100 bg-green-50/50">
                                        <TableHead className="text-green-700">No</TableHead>
                                        <TableHead className="text-green-700">Nama</TableHead>
                                        <TableHead className="text-green-700">Tanggal</TableHead>
                                        <TableHead className="text-green-700">Berat (kg)</TableHead>
                                        <TableHead className="text-green-700">Jenis Sampah</TableHead>
                                        <TableHead className="text-green-700">Tujuan</TableHead>
                                        <TableHead className="text-green-700">Lokasi</TableHead>
                                        <TableHead className="text-right text-green-700">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center text-green-600/70">
                                                Tidak ada data yang cocok.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filtered.map((item, index) => (
                                            <TableRow key={item.id} className="border-green-100">
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell className="font-medium">{item.nama}</TableCell>
                                                <TableCell>{new Date(item.tanggal).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</TableCell>
                                                <TableCell className="font-medium">
                                                    {Number(item.berat).toLocaleString('id-ID', { minimumFractionDigits: 2 })} kg
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${jenisSampahColors[item.jenis_sampah] ?? 'bg-gray-100 text-gray-700'}`}>
                                                        {item.jenis_sampah}
                                                    </span>
                                                </TableCell>
                                                <TableCell>{item.tujuan_distribusi}</TableCell>
                                                <TableCell>{item.lokasi}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="outline" size="sm" asChild className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800">
                                                            <Link href={`/distribusi/${item.id}/edit`} className="flex items-center gap-1">
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
