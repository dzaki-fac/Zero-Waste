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

type Penimbangan = {
    id: number;
    nama: string;
    tanggal: string;
    berat_sampah: string;
    area: string;
    sub_area: string;
};

type Props = {
    penimbangan: Penimbangan;
};

const subAreaMap: Record<string, string[]> = {
    'Lantai 1': ['Area Baca', 'Kamar Kecil'],
    'Lantai 2': ['Area Baca', 'Kamar Kecil'],
    'Lantai 3': ['Area Baca', 'Kamar Kecil'],
    'Lantai 4': ['Area Pertemuan', 'Area Kantor', 'Kamar Kecil'],
};

export default function PenimbanganEdit({ penimbangan }: Props) {
    const initialTanggal = (() => {
        const d = new Date(penimbangan.tanggal);
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    })();

    const initialSubArea = subAreaMap[penimbangan.area]?.includes(penimbangan.sub_area)
        ? penimbangan.sub_area
        : '';

    const { data, setData, put, processing, errors } = useForm({
        nama: penimbangan.nama,
        tanggal: initialTanggal,
        berat_sampah: penimbangan.berat_sampah,
        area: penimbangan.area,
        sub_area: initialSubArea,
    });

    const subAreaOptions = subAreaMap[data.area] ?? null;

    const handleAreaChange = (value: string) => {
        setData('area', value);
        setData('sub_area', '');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/penimbangan/${penimbangan.id}`);
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
                            <Label htmlFor="area" className="text-green-700">Area</Label>
                            <Select name="area" value={data.area} onValueChange={handleAreaChange}>
                                <SelectTrigger className="w-full border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20">
                                    <SelectValue placeholder="Pilih area" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Lantai 1">Lantai 1</SelectItem>
                                    <SelectItem value="Lantai 2">Lantai 2</SelectItem>
                                    <SelectItem value="Lantai 3">Lantai 3</SelectItem>
                                    <SelectItem value="Lantai 4">Lantai 4</SelectItem>
                                    <SelectItem value="Area Teras">Area Teras</SelectItem>
                                    <SelectItem value="Area Halaman">Area Halaman</SelectItem>
                                    <SelectItem value="Area Parkir">Area Parkir</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.area} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="sub_area" className="text-green-700">Sub Area</Label>
                            {subAreaOptions ? (
                                <Select name="sub_area" value={data.sub_area} onValueChange={(v) => setData('sub_area', v)}>
                                    <SelectTrigger className="w-full border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20">
                                        <SelectValue placeholder="Pilih sub area" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subAreaOptions.map((option) => (
                                            <SelectItem key={option} value={option}>{option}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Input
                                    id="sub_area"
                                    name="sub_area"
                                    value=""
                                    disabled
                                    placeholder="Sub area tidak tersedia"
                                    className="border-green-200 bg-green-50 text-green-500 placeholder:text-green-500"
                                />
                            )}
                            <InputError message={errors.sub_area} />
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <Button disabled={processing} type="submit" className="bg-green-600 hover:bg-green-700">
                                <Save className="h-4 w-4" />
                                Perbarui
                            </Button>
                            <Button variant="outline" asChild className="border-green-200 text-green-700 hover:bg-green-50">
                                <Link href="/admin/penimbangan" className="flex items-center gap-1">
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
