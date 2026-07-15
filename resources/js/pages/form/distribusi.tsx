import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save, Calendar, Weight, User, Trash2, MapPin, Ship } from 'lucide-react';

const jenisSampahOptions = [
    'Daun', 'Ranting besar', 'Ranting kecil', 'Sisa makanan',
    'Plastik berwarna', 'Plastik putih', 'Styrofoam', 'Botol',
    'Kardus dan Kertas', 'B3', 'Lainnya',
];

const tujuanOptions = ['TPS', 'Pupuk/kompos', 'PlasticPay', 'Tujuan lainnya'];

export default function FormDistribusi() {
    const { auth } = usePage().props as { auth: { user: { name: string } } };
    const { data, setData, post, processing, errors } = useForm({
        nama: auth.user.name,
        tanggal: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
        berat: '',
        jenis_sampah: '',
        tujuan_distribusi: '',
        lokasi: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/distribusi');
    };

    const now = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    const todayDate = now.slice(0, 10);
    const todayTime = now.slice(11, 16);

    return (
        <>
            <Head title="Tambah Distribusi" />

            <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-gradient-to-b from-green-50/50 to-white">
                <div className="flex-1 px-4 pb-32 pt-6">
                    <Heading
                        title="Tambah Distribusi"
                        description="Masukkan data distribusi sampah baru"
                    />

                    <form onSubmit={handleSubmit} className="mt-6 space-y-6" noValidate>
                        <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-green-700">
                                <User className="h-4 w-4" />
                                Data Petugas
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="nama" className="text-xs font-medium text-gray-600">Nama Petugas</Label>
                                <Input
                                    id="nama"
                                    name="nama"
                                    value={data.nama}
                                    readOnly
                                    required
                                    className="h-12 border-green-200 bg-green-50 text-base text-green-600"
                                />
                                <InputError message={errors.nama} />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-green-700">
                                <Calendar className="h-4 w-4" />
                                Waktu
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="tanggal" className="text-xs font-medium text-gray-600">Tanggal & Waktu</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Input
                                            id="tanggal_date"
                                            type="date"
                                            value={data.tanggal ? data.tanggal.slice(0, 10) : todayDate}
                                            onChange={(e) => {
                                                const time = data.tanggal ? data.tanggal.slice(11, 16) : todayTime;
                                                setData('tanggal', `${e.target.value}T${time}`);
                                            }}
                                            required
                                            className="h-12 border-green-200 text-base"
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            id="tanggal_time"
                                            type="time"
                                            value={data.tanggal ? data.tanggal.slice(11, 16) : todayTime}
                                            onChange={(e) => {
                                                const date = data.tanggal ? data.tanggal.slice(0, 10) : todayDate;
                                                setData('tanggal', `${date}T${e.target.value}`);
                                            }}
                                            required
                                            className="h-12 border-green-200 text-base"
                                        />
                                    </div>
                                </div>
                                <InputError message={errors.tanggal} />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-green-700">
                                <Weight className="h-4 w-4" />
                                Berat Sampah
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="berat" className="text-xs font-medium text-gray-600">Berat (kg)</Label>
                                <div className="relative">
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
                                        inputMode="decimal"
                                        className="h-12 border-green-200 ps-8 text-lg"
                                    />
                                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-green-600">kg</span>
                                </div>
                                <InputError message={errors.berat} />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-green-700">
                                <Trash2 className="h-4 w-4" />
                                Jenis Sampah
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-xs font-medium text-gray-600">Pilih jenis sampah</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {jenisSampahOptions.map((opt) => {
                                        const isSelected = data.jenis_sampah === opt;
                                        return (
                                            <button
                                                key={opt}
                                                type="button"
                                                onClick={() => setData('jenis_sampah', opt)}
                                                className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all active:scale-95 ${
                                                    isSelected
                                                        ? 'border-green-500 bg-green-50 text-green-700 shadow-sm'
                                                        : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-green-200 hover:bg-green-50/50'
                                                }`}
                                            >
                                                {opt}
                                            </button>
                                        );
                                    })}
                                </div>
                                <InputError message={errors.jenis_sampah} />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-green-700">
                                <Ship className="h-4 w-4" />
                                Distribusi
                            </div>

                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-medium text-gray-600">Tujuan Distribusi</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {tujuanOptions.map((opt) => {
                                            const isSelected = data.tujuan_distribusi === opt;
                                            return (
                                                <button
                                                    key={opt}
                                                    type="button"
                                                    onClick={() => setData('tujuan_distribusi', opt)}
                                                    className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all active:scale-95 ${
                                                        isSelected
                                                            ? 'border-green-500 bg-green-50 text-green-700 shadow-sm'
                                                            : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-green-200 hover:bg-green-50/50'
                                                    }`}
                                                >
                                                    {opt}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <InputError message={errors.tujuan_distribusi} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="lokasi" className="text-xs font-medium text-gray-600">Lokasi</Label>
                                    <div className="relative">
                                        <Input
                                            id="lokasi"
                                            name="lokasi"
                                            value={data.lokasi}
                                            onChange={(e) => setData('lokasi', e.target.value)}
                                            required
                                            placeholder="Masukkan lokasi"
                                            className="h-12 border-green-200 ps-10 text-base"
                                        />
                                        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                                    </div>
                                    <InputError message={errors.lokasi} />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="fixed inset-x-0 bottom-0 border-t border-green-100 bg-white/80 px-4 pb-safe pb-3 pt-3 shadow-lg backdrop-blur-md">
                    <div className="mx-auto flex max-w-lg gap-3">
                        <Button
                            variant="outline"
                            asChild
                            className="flex-1 border-green-200 text-sm text-green-700 hover:bg-green-50"
                        >
                            <Link href="/distribusi" className="flex items-center justify-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Batal
                            </Link>
                        </Button>
                        <Button
                            disabled={processing}
                            type="submit"
                            onClick={handleSubmit}
                            className="flex-1 bg-green-600 text-sm hover:bg-green-700 active:bg-green-800"
                        >
                            <Save className="h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
