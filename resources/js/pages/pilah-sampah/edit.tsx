import { Head, Link, useForm, usePage } from '@inertiajs/react';
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
import type { Auth } from '@/types';

type PilahSampah = {
    id: number;
    nama: string;
    tanggal: string;
    area: string | null;
    berat: string;
    jenis_sampah: string | null;
    subjenis_sampah: string | null;
};

type Options = {
    area: string[];
    subjenis_sampah: string[];
    tujuan_distribusi: string[];
};

type Props = {
    pilahSampah: PilahSampah;
};

export default function PilahSampahEdit({ pilahSampah }: Props) {
    const { auth, options } = usePage().props as unknown as { auth: Auth; options: Options };
    const prefix = auth.user.role === 'admin' ? '/admin' : '/petugas';

    const initialTanggal = (() => {
        const d = new Date(pilahSampah.tanggal);
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    })();

    const { data, setData, put, processing, errors } = useForm({
        nama: pilahSampah.nama,
        tanggal: initialTanggal,
        berat: pilahSampah.berat,
        subjenis_sampah: pilahSampah.subjenis_sampah ?? pilahSampah.jenis_sampah ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`${prefix}/pilah-sampah/${pilahSampah.id}`);
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
                            <Label htmlFor="subjenis_sampah" className="text-green-700">Subjenis Sampah</Label>
                            <Select name="subjenis_sampah" value={data.subjenis_sampah} onValueChange={(v) => setData('subjenis_sampah', v)}>
                                <SelectTrigger className="w-full border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20">
                                    <SelectValue placeholder="Pilih subjenis" />
                                </SelectTrigger>
                                <SelectContent>
                                    {options.subjenis_sampah.map((opt) => (
                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.subjenis_sampah} />
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <Button disabled={processing} type="submit" className="bg-green-600 hover:bg-green-700">
                                <Save className="h-4 w-4" />
                                Perbarui
                            </Button>
                            <Button variant="outline" asChild className="border-green-200 text-green-700 hover:bg-green-50">
                                <Link href={`${prefix}/pilah-sampah`} className="flex items-center gap-1">
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
