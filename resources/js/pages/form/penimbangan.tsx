import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Send, Calendar, User, Trash2, CheckCircle2, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Options = {
    area: string[];
    jenis_sampah: string[];
    tujuan_distribusi: string[];
};

export default function FormPenimbangan() {
    const { auth, submitted, options } = usePage().props as unknown as {
        auth: { user: { name: string } };
        submitted: Record<string, unknown> | null;
        options: Options;
    };

    const areaOptions = options.area;
    const jenisSampahOptions = options.jenis_sampah;
    const { data, setData, post, processing, errors } = useForm({
        _redirect: '/form',
        nama: auth.user.name,
        tanggal: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
        area: '',
        items: jenisSampahOptions.map((jenis) => ({ jenis_sampah: jenis, berat: '' })),
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [areaError, setAreaError] = useState('');

    useEffect(() => {
        if (submitted) {
setShowSuccess(true);
}
    }, [submitted]);

    useEffect(() => {
        if (data.area) {
setAreaError('');
}
    }, [data.area]);

    const totalBerat = data.items.reduce((sum, item) => sum + (parseFloat(item.berat) || 0), 0);
    const filledCount = data.items.filter((item) => parseFloat(item.berat) > 0).length;

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.area) {
            setAreaError('Pilih area terlebih dahulu');
            scrollTo('section-area');

            return;
        }

        const filledCount = data.items.filter((item) => parseFloat(item.berat) > 0).length;

        if (!filledCount) {
            setSubmitError('Minimal isi berat pada 1 jenis sampah');
            scrollTo('section-jenis-berat');

            return;
        }

        setSubmitError('');
        post('/petugas/penimbangan');
    };

    const now = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    const todayDate = now.slice(0, 10);
    const todayTime = now.slice(11, 16);

    const submittedItems = submitted?.items as Array<Record<string, string | number>> | undefined;

    return (
        <>
            <Head title="Tambah Penimbangan" />

            <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-linear-to-b from-green-50/50 to-white">
                <div className="flex-1 px-4 pb-36 pt-6">
                    <Heading
                        title="Tambah Penimbangan"
                        description="Isi berat pada jenis sampah yang akan ditimbang"
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                        <div id="section-area" className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-green-700">
                                <MapPin className="h-4 w-4" />
                                Lokasi
                            </div>

                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-medium text-gray-600">Pilih Area</Label>
                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                        {areaOptions.map((opt) => {
                                            const isSelected = data.area === opt;

                                            return (
                                                <button
                                                    key={opt}
                                                    type="button"
                                                    onClick={() => setData('area', opt)}
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
                                    <InputError message={errors.area || areaError} />
                                </div>
                            </div>
                        </div>

                        <div id="section-jenis-berat" className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-green-700">
                                <Trash2 className="h-4 w-4" />
                                Jenis & Berat Sampah
                            </div>
                            <p className="-mt-2 mb-3 text-xs text-gray-500">Isi berat pada minimal 1 jenis sampah (boleh lebih dari satu)</p>

                            <div className="divide-y divide-green-100 rounded-xl border border-green-100 overflow-hidden">
                                {data.items.map((item, i) => (
                                    <div key={item.jenis_sampah} className="flex items-center gap-3 px-4 py-2.5 bg-white even:bg-green-50/30">
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
                                                className="h-10 border-green-200 pe-8 text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                            />
                                            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-green-600">kg</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {submitError && (
                                <p className="mt-2 text-sm text-red-500">{submitError}</p>
                            )}

                            <div className="mt-3 flex items-center justify-between rounded-lg bg-green-100 px-4 py-2.5">
                                <span className="text-sm font-medium text-green-700">
                                    Total{filledCount > 0 ? ` (${filledCount} jenis)` : ''}
                                </span>
                                <span className="text-sm font-bold text-green-800">{totalBerat.toFixed(2)} kg</span>
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
                            oleh <span className="font-medium text-green-700">{submitted?.nama as string}</span>
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
                            <span className="text-gray-500">Area</span>
                            <span className="font-medium text-gray-800">{String(submitted?.area ?? '-')}</span>
                        </div>

                        {submittedItems?.map((item, i) => (
                            <div key={i} className="flex items-center justify-between px-4 py-2 text-sm">
                                <span className="text-gray-500">{item.jenis_sampah as string}</span>
                                <span className="font-medium text-gray-800">{Number(item.berat_sampah).toFixed(2)} kg</span>
                            </div>
                        ))}

                        <div className="flex items-center justify-between bg-green-100/50 px-4 py-2.5 text-sm font-semibold">
                            <span className="text-green-700">Total</span>
                            <span className="text-green-800">{Number(submitted?.total_berat ?? 0).toFixed(2)} kg</span>
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
