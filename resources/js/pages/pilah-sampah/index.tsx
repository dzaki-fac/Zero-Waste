import { Head, Link, router } from '@inertiajs/react';
import { Leaf, Plus, Trash2, Pencil } from 'lucide-react';
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

type PilahSampah = {
    id: number;
    nama: string;
    tanggal: string;
    berat: string;
    jenis_sampah: string;
};

type Props = {
    pilahSampah: PilahSampah[];
};

const jenisSampahColors: Record<string, string> = {
    organik: 'bg-green-100 text-green-700',
    anorganik: 'bg-amber-100 text-amber-700',
    B3: 'bg-red-100 text-red-700',
};

export default function PilahSampahIndex({ pilahSampah }: Props) {
    const isEmpty = pilahSampah.length === 0;

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus data ini?')) {
            router.delete(`/pilah-sampah/${id}`);
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

                    <Button asChild className="bg-green-600 hover:bg-green-700">
                        <Link href="/pilah-sampah/create" className="flex items-center gap-2">
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
                            Belum ada data pilah sampah
                        </h3>
                        <p className="mt-1 max-w-sm text-sm text-green-600/70">
                            Mulai catat data pemilahan sampah untuk membantu pengelolaan lingkungan yang lebih baik.
                        </p>
                        <Button asChild className="mt-6 bg-green-600 hover:bg-green-700">
                            <Link href="/pilah-sampah/create" className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Tambah Pilah Sampah
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="rounded-xl border border-green-200 bg-white shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-green-100 bg-green-50/50">
                                    <TableHead className="text-green-700">No</TableHead>
                                    <TableHead className="text-green-700">Nama</TableHead>
                                    <TableHead className="text-green-700">Tanggal</TableHead>
                                    <TableHead className="text-green-700">Berat (kg)</TableHead>
                                    <TableHead className="text-green-700">Jenis Sampah</TableHead>
                                    <TableHead className="text-right text-green-700">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pilahSampah.map((item, index) => (
                                    <TableRow key={item.id} className="border-green-100">
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell className="font-medium">{item.nama}</TableCell>
                                        <TableCell>{new Date(item.tanggal).toLocaleDateString('id-ID')}</TableCell>
                                        <TableCell className="font-medium">
                                            {Number(item.berat).toLocaleString('id-ID', { minimumFractionDigits: 2 })} kg
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${jenisSampahColors[item.jenis_sampah] ?? 'bg-gray-100 text-gray-700'}`}>
                                                {item.jenis_sampah.charAt(0).toUpperCase() + item.jenis_sampah.slice(1)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="sm" asChild className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800">
                                                    <Link href={`/pilah-sampah/${item.id}/edit`} className="flex items-center gap-1">
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
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </>
    );
}
