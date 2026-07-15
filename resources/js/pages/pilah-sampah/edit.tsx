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

type PilahSampah = {
    id: number;
    nama: string;
    tanggal: string;
    berat: string;
    jenis_sampah: string;
};

type Props = {
    pilahSampah: PilahSampah;
};

export default function PilahSampahEdit({ pilahSampah }: Props) {
    const initialTanggal = (() => {
        const d = new Date(pilahSampah.tanggal);
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    })();

    const { data, setData, put, processing, errors } = useForm({
        nama: pilahSampah.nama,
        tanggal: initialTanggal,
        berat: pilahSampah.berat,
        jenis_sampah: pilahSampah.jenis_sampah,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/pilah-sampah/${pilahSampah.id}`);
    };

    return (
        <>
            <Head title="Edit Pilah Sampah" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Edit Pilah Sampah"
                    description="Perbarui data pilah sampah"
                />

                <div className="rounded-xl border border-green-200 bg-white p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid gap-2">
                            <Label htmlFor="nama" className="text-green-700">Nama</Label>
                            <Input
                                id="nama"
                                name="nama"
                                value={data.nama}
                                readOnly
                                required
                                className="border-green-200 bg-green-50 text-green-500"
                            />
                            <InputError message={errors.nama} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="tanggal" className="text-green-700">Tanggal</Label>
                            <Input
                                id="tanggal"
                                name="tanggal"
                                type="datetime-local"
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
                                    <SelectItem value="Daun">Daun</SelectItem>
                                    <SelectItem value="Ranting besar">Ranting besar</SelectItem>
                                    <SelectItem value="Ranting kecil">Ranting kecil</SelectItem>
                                    <SelectItem value="Sisa makanan">Sisa makanan</SelectItem>
                                    <SelectItem value="Plastik berwarna">Plastik berwarna</SelectItem>
                                    <SelectItem value="Plastik putih">Plastik putih</SelectItem>
                                    <SelectItem value="Styrofoam">Styrofoam</SelectItem>
                                    <SelectItem value="Botol">Botol</SelectItem>
                                    <SelectItem value="Kardus dan Kertas">Kardus dan Kertas</SelectItem>
                                    <SelectItem value="B3">B3</SelectItem>
                                    <SelectItem value="Lainnya">Lainnya</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.jenis_sampah} />
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <Button disabled={processing} type="submit" className="bg-green-600 hover:bg-green-700">
                                <Save className="h-4 w-4" />
                                Perbarui
                            </Button>
                            <Button variant="outline" asChild className="border-green-200 text-green-700 hover:bg-green-50">
                                <Link href="/admin/pilah-sampah" className="flex items-center gap-1">
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
