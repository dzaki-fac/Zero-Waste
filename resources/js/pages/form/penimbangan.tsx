import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Send, MapPin, Calendar, Weight, User, CheckCircle2 } from 'lucide-react';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';

const areaOptions = [
    { value: 'Lantai 1', label: 'Lantai 1', icon: '1' },
    { value: 'Lantai 2', label: 'Lantai 2', icon: '2' },
    { value: 'Lantai 3', label: 'Lantai 3', icon: '3' },
    { value: 'Lantai 4', label: 'Lantai 4', icon: '4' },
    { value: 'Area Teras', label: 'Teras', icon: 'T' },
    { value: 'Area Halaman', label: 'Halaman', icon: 'H' },
    { value: 'Area Parkir', label: 'Parkir', icon: 'P' },
];

const lantaiValues = ['Lantai 1', 'Lantai 2', 'Lantai 3', 'Lantai 4'];

const subAreaByLantai: Record<string, string[]> = {
    'Lantai 1': ['Area Baca', 'Kamar Kecil'],
    'Lantai 2': ['Area Baca', 'Kamar Kecil'],
    'Lantai 3': ['Area Baca', 'Kamar Kecil'],
    'Lantai 4': ['Kamar Kecil', 'Area Kantor', 'Area Pertemuan'],
};

export default function FormPenimbangan() {
    const { auth, submitted } = usePage().props as {
        auth: { user: { name: string } };
        submitted: Record<string, string | number | null> | null;
    };
    const { data, setData, post, processing, errors } = useForm({
        _redirect: '/form',
        nama: auth.user.name,
        tanggal: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
        berat_sampah: '',
        area: '',
        sub_area: '',
    });

    const isLantai = lantaiValues.includes(data.area);

    const handleAreaChange = (value: string) => {
        setData('area', value);
        if (!lantaiValues.includes(value)) {
            setData('sub_area', '-');
        } else {
            setData('sub_area', '');
        }
    };

    const [showSuccess, setShowSuccess] = useState(false);
    const [areaError, setAreaError] = useState('');
    const [subAreaError, setSubAreaError] = useState('');
    const [beratError, setBeratError] = useState('');

    useEffect(() => {
        if (submitted) setShowSuccess(true);
    }, [submitted]);

    useEffect(() => {
        if (data.area) setAreaError('');
    }, [data.area]);

    useEffect(() => {
        if (data.sub_area) setSubAreaError('');
    }, [data.sub_area]);

    useEffect(() => {
        if (data.berat_sampah) setBeratError('');
    }, [data.berat_sampah]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.berat_sampah) {
            setBeratError('Masukkan berat sampah');
            return;
        }
        if (!data.area) {
            setAreaError('Pilih area terlebih dahulu');
            return;
        }
        if (isLantai && !data.sub_area) {
            setSubAreaError('Silakan pilih sub area terlebih dahulu');
            return;
        }
        post('/admin/penimbangan');
    };

    const now = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);

    const todayDate = now.slice(0, 10);
    const todayTime = now.slice(11, 16);

    return (
        <>
            <Head title="Tambah Penimbangan" />

            <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-gradient-to-b from-green-50/50 to-white">
                <div className="flex-1 px-4 pb-32 pt-6">
                    <Heading
                        title="Tambah Penimbangan"
                        description="Masukkan data penimbangan sampah baru"
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
                                Waktu Penimbangan
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="tanggal" className="text-xs font-medium text-gray-600">Tanggal & Waktu</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Input
                                            id="tanggal_date"
                                            name="tanggal_date"
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
                                            name="tanggal_time"
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
                                <Label htmlFor="berat_sampah" className="text-xs font-medium text-gray-600">Berat (kg)</Label>
                                <div className="relative">
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
                                        inputMode="decimal"
                                        onWheel={(e) => e.currentTarget.blur()}
                                        className="h-12 border-green-200 pe-8 text-lg [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                    />
                                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-green-600">kg</span>
                                </div>
                                <InputError message={errors.berat_sampah || beratError} />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-green-700">
                                <MapPin className="h-4 w-4" />
                                Lokasi
                            </div>

                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-medium text-gray-600">Pilih Area</Label>
                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                        {areaOptions.map((opt) => {
                                            const isSelected = data.area === opt.value;
                                            return (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => handleAreaChange(opt.value)}
                                                    className={`flex flex-col items-center gap-1 rounded-xl border-2 px-3 py-3 text-center text-sm font-medium transition-all active:scale-95 ${
                                                        isSelected
                                                            ? 'border-green-500 bg-green-50 text-green-700 shadow-sm'
                                                            : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-green-200 hover:bg-green-50/50'
                                                    }`}
                                                >
                                                    <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                                                        isSelected ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                                                    }`}>
                                                        {opt.icon}
                                                    </span>
                                                    <span>{opt.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <InputError message={errors.area || areaError} />
                                </div>

                                {isLantai ? (
                                    <div id="sub_area_section" className="grid gap-2">
                                        <Label className="text-xs font-medium text-gray-600">Pilih Sub Area</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {subAreaByLantai[data.area]?.map((opt) => {
                                                const isSelected = data.sub_area === opt;
                                                return (
                                                    <button
                                                        key={opt}
                                                        type="button"
                                                        onClick={() => setData('sub_area', opt)}
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
                                        <InputError message={errors.sub_area || subAreaError} />
                                    </div>
                                ) : (
                                    <div className="grid gap-2">
                                        <Label className="text-xs font-medium text-gray-600">Sub Area</Label>
                                        <Input
                                            value="-"
                                            disabled
                                            className="h-12 border-green-200 bg-green-50 text-base text-green-500"
                                        />
                                    </div>
                                )}
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
                            <Link href="/form" className="flex items-center justify-center gap-2">
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
                            <Send className="h-4 w-4" />
                            {processing ? 'Mengirim...' : 'Kirim'}
                        </Button>
                    </div>
                </div>
            </div>

            <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                        <DialogTitle className="text-center text-green-800">Data Berhasil Disimpan</DialogTitle>
                        <DialogDescription className="text-center">
                            oleh <span className="font-medium text-green-700">{submitted?.nama}</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="divide-y divide-green-100 rounded-lg border border-green-100 bg-green-50/50">
                        <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                            <span className="text-gray-500">Tanggal</span>
                            <span className="font-medium text-gray-800">
                                {submitted?.tanggal
                                    ? new Date(submitted.tanggal as string).toLocaleString('id-ID', {
                                        year: 'numeric', month: 'long', day: 'numeric',
                                        hour: '2-digit', minute: '2-digit',
                                    })
                                    : '-'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                            <span className="text-gray-500">Berat Sampah</span>
                            <span className="font-medium text-gray-800">{String(submitted?.berat_sampah ?? '-')} kg</span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                            <span className="text-gray-500">Area</span>
                            <span className="font-medium text-gray-800">{String(submitted?.area ?? '-')}</span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                            <span className="text-gray-500">Sub Area</span>
                            <span className="font-medium text-gray-800">{String(submitted?.sub_area ?? '-')}</span>
                        </div>
                    </div>

                    <Button onClick={() => router.visit('/form')} className="w-full bg-green-600 hover:bg-green-700">
                        Tutup
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
}
