import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { route } from 'ziggy-js';
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

type Penimbangan = {
    id: number;
    nama: string;
    tanggal: string;
    berat_sampah: string;
    jenis_sampah: string | null;
    area: string;
};

type Options = {
    area: string[];
    jenis_sampah: string[];
    tujuan_distribusi: string[];
};

type Props = {
    penimbangan: Penimbangan;
};

export default function PenimbanganEdit({ penimbangan }: Props) {
    const { auth, options } = usePage().props as unknown as { auth: Auth; options: Options };
    const role = auth.user.role;

    const initialTanggal = (() => {
        const d = new Date(penimbangan.tanggal);

        return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    })();

    const { data, setData, put, processing, errors } = useForm({
        nama: penimbangan.nama,
        tanggal: initialTanggal,
        berat_sampah: penimbangan.berat_sampah,
        jenis_sampah: penimbangan.jenis_sampah ?? '',
        area: penimbangan.area,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route(`${role}.penimbangan.update`, { penimbangan: penimbangan.id }));
    };

    return (
        <>
            <Head title="Edit Penimbangan" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Edit Penimbangan"
                    description="Perbarui data penimbangan sampah"
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
                            <Label htmlFor="berat_sampah" className="text-green-700">Berat Sampah (kg)</Label>
                            <Input
                                id="berat_sampah"
                                name="berat_sampah"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.berat_sampah}
                                onChange={(e) => setData('berat_sampah', e.target.value)}
                                required
                                placeholder="0.00"
                                className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                            />
                            <InputError message={errors.berat_sampah} />
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-green-700">Jenis Sampah</Label>
                            <Select value={data.jenis_sampah} onValueChange={(v) => setData('jenis_sampah', v)}>
                                <SelectTrigger className="w-full border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20">
                                    <SelectValue placeholder="Pilih jenis" />
                                </SelectTrigger>
                                <SelectContent>
                                    {options.jenis_sampah.map((opt) => (
                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.jenis_sampah} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="area" className="text-green-700">Area</Label>
                            <Select name="area" value={data.area} onValueChange={(v) => setData('area', v)}>
                                <SelectTrigger className="w-full border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20">
                                    <SelectValue placeholder="Pilih area" />
                                </SelectTrigger>
                                <SelectContent>
                                    {options.area.map((opt) => (
                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.area} />
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <Button disabled={processing} type="submit" className="bg-green-600 hover:bg-green-700">
                                <Save className="h-4 w-4" />
                                Perbarui
                            </Button>
                            <Button variant="outline" asChild className="border-green-200 text-green-700 hover:bg-green-50">
                                <Link href={route(`${role}.penimbangan.index`)} className="flex items-center gap-1">
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
