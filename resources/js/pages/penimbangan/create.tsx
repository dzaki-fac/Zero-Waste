import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save, Calendar, User, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Options = {
    area: string[];
    jenis_sampah: string[];
    tujuan_distribusi: string[];
};

export default function PenimbanganCreate() {
    const { auth, options } = usePage().props as unknown as {
        auth: { user: { name: string } };
        options: Options;
    };

    const jenisSampahOptions = options.jenis_sampah;
    const { data, setData, post, processing, errors } = useForm({
        _redirect: '/admin',
        nama: auth.user.name,
        tanggal: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
        area: '',
        items: jenisSampahOptions.map((jenis) => ({ jenis_sampah: jenis, berat: '' })),
    });

    const [submitError, setSubmitError] = useState('');
    const [areaError, setAreaError] = useState('');

    useEffect(() => {
        if (data.area) {
setAreaError('');
}
    }, [data.area]);

    const role = auth.user.role;
    const totalBerat = data.items.reduce((sum, item) => sum + (parseFloat(item.berat) || 0), 0);
    const filledCount = data.items.filter((item) => parseFloat(item.berat) > 0).length;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.area) {
            setAreaError('Pilih area terlebih dahulu');

            return;
        }

        const filled = data.items.filter((item) => parseFloat(item.berat) > 0).length;

        if (!filled) {
            setSubmitError('Minimal isi berat pada 1 jenis sampah');

            return;
        }

        setSubmitError('');
        post(route(`${role}.penimbangan.store`));
    };

    const now = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    const todayDate = now.slice(0, 10);
    const todayTime = now.slice(11, 16);

    return (
        <>
            <Head title="Tambah Penimbangan" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Tambah Penimbangan"
                    description="Isi berat pada jenis sampah yang akan ditimbang"
                />

                <div className="rounded-xl border border-green-200 bg-white p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid gap-2">
                            <Label htmlFor="nama" className="text-green-700">Nama Petugas</Label>
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
                            <Label htmlFor="tanggal" className="text-green-700">Tanggal & Waktu</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Input
                                    id="tanggal_date"
                                    type="date"
                                    value={data.tanggal ? data.tanggal.slice(0, 10) : todayDate}
                                    onChange={(e) => {
                                        const time = data.tanggal ? data.tanggal.slice(11, 16) : todayTime;
                                        setData('tanggal', `${e.target.value}T${time}`);
                                    }}
                                    required
                                    className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                                />
                                <Input
                                    id="tanggal_time"
                                    type="time"
                                    value={data.tanggal ? data.tanggal.slice(11, 16) : todayTime}
                                    onChange={(e) => {
                                        const date = data.tanggal ? data.tanggal.slice(0, 10) : todayDate;
                                        setData('tanggal', `${date}T${e.target.value}`);
                                    }}
                                    required
                                    className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                                />
                            </div>
                            <InputError message={errors.tanggal} />
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-green-700">Area</Label>
                            <div className="flex flex-wrap gap-2">
                                {options.area.map((opt) => {
                                    const isSelected = data.area === opt;

                                    return (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setData('area', opt)}
                                            className={`rounded-xl border-2 px-4 py-2 text-sm font-medium transition-all ${
                                                isSelected
                                                    ? 'border-green-500 bg-green-50 text-green-700 shadow-sm'
                                                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-green-200 hover:bg-green-50'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>
                            <InputError message={errors.area || areaError} />
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-green-700">Jenis & Berat Sampah</Label>
                            <p className="-mt-1 text-xs text-gray-500">Isi berat pada minimal 1 jenis sampah (boleh lebih dari satu)</p>

                            <div className="divide-y divide-green-100 rounded-lg border border-green-200 overflow-hidden">
                                {data.items.map((item, i) => (
                                    <div key={item.jenis_sampah} className="flex items-center gap-3 px-4 py-2 bg-white even:bg-green-50/30">
                                        <span className="min-w-0 flex-1 text-sm font-medium text-gray-700">{item.jenis_sampah}</span>
                                        <div className="relative w-32 shrink-0">
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={item.berat}
                                                onChange={(e) => {
                                                    const items = data.items.map((it, idx) =>
                                                        idx === i ? { ...it, berat: e.target.value } : it
                                                    );
                                                    setData('items', items);
                                                    setSubmitError('');
                                                }}
                                                placeholder="0.00"
                                                inputMode="decimal"
                                                onWheel={(e) => e.currentTarget.blur()}
                                                className="h-9 border-green-200 pe-8 text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                            />
                                            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-green-600">kg</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {submitError && (
                                <p className="text-sm text-red-500">{submitError}</p>
                            )}

                            <div className="flex items-center justify-between rounded-lg bg-green-100 px-4 py-2">
                                <span className="text-sm font-medium text-green-700">
                                    Total{filledCount > 0 ? ` (${filledCount} jenis)` : ''}
                                </span>
                                <span className="text-sm font-bold text-green-800">{totalBerat.toFixed(2)} kg</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <Button disabled={processing} type="submit" className="bg-green-600 hover:bg-green-700">
                                <Save className="h-4 w-4" />
                                {processing ? 'Menyimpan...' : 'Simpan'}
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