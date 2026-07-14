import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function DistribusiCreate() {
    const { data, setData, post, processing, errors } = useForm({
        nama: '',
        tanggal: '',
        berat: '',
        jenis_sampah: '',
        tujuan_distribusi: '',
        lokasi: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/distribusi');
    };

    return (
        <>
            <Head title="Tambah Distribusi" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Tambah Distribusi"
                    description="Masukkan data distribusi sampah baru"
                />

                <div className="rounded-xl border border-green-200 bg-white p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid gap-2">
                            <Label htmlFor="nama" className="text-green-700">Nama</Label>
                            <Input
                                id="nama"
                                name="nama"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                required
                                placeholder="Masukkan nama"
                                className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                            />
                            <InputError message={errors.nama} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="tanggal" className="text-green-700">Tanggal</Label>
                            <Input
                                id="tanggal"
                                name="tanggal"
                                type="date"
                                value={data.tanggal}
                                onChange={(e) => setData('tanggal', e.target.value)}
                                required
                                className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                            />
                            <InputError message={errors.tanggal} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="berat" className="text-green-700">Berat (kg)</Label>
                            <Input
                                id="berat"
                                name="berat"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.berat}
                                onChange={(e) => setData('berat', e.target.value)}
                                required
                                placeholder="0.00"
                                className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                            />
                            <InputError message={errors.berat} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="jenis_sampah" className="text-green-700">Jenis Sampah</Label>
                            <Select name="jenis_sampah" value={data.jenis_sampah} onValueChange={(v) => setData('jenis_sampah', v)}>
                                <SelectTrigger className="w-full border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20">
                                    <SelectValue placeholder="Pilih jenis sampah" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="organik">Organik</SelectItem>
                                    <SelectItem value="anorganik">Anorganik</SelectItem>
                                    <SelectItem value="B3">B3</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.jenis_sampah} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="tujuan_distribusi" className="text-green-700">Tujuan Distribusi</Label>
                            <Input
                                id="tujuan_distribusi"
                                name="tujuan_distribusi"
                                value={data.tujuan_distribusi}
                                onChange={(e) => setData('tujuan_distribusi', e.target.value)}
                                required
                                placeholder="Masukkan tujuan distribusi"
                                className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                            />
                            <InputError message={errors.tujuan_distribusi} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="lokasi" className="text-green-700">Lokasi</Label>
                            <Input
                                id="lokasi"
                                name="lokasi"
                                value={data.lokasi}
                                onChange={(e) => setData('lokasi', e.target.value)}
                                required
                                placeholder="Masukkan lokasi"
                                className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                            />
                            <InputError message={errors.lokasi} />
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <Button disabled={processing} type="submit" className="bg-green-600 hover:bg-green-700">
                                <Save className="h-4 w-4" />
                                Simpan
                            </Button>
                            <Button variant="outline" asChild className="border-green-200 text-green-700 hover:bg-green-50">
                                <Link href="/distribusi" className="flex items-center gap-1">
                                    <ArrowLeft className="h-4 w-4" />
                                    Batal
                                </Link>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
