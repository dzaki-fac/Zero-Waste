import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, CheckCircle2, Circle, MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { baseUrl } from '@/lib/path';

type MasterTask = {
    id: number;
    nama_pekerjaan: string;
    jenis_pekerjaan: string;
    urutan: number;
};

type ChecklistRecord = {
    id: number;
    status: 'sudah' | 'belum';
};

type ChecklistItem = {
    master_pekerjaan_id: number;
    tugas: string;
    status: 'sudah' | 'belum';
    jenis_pekerjaan: string;
};

type PageProps = {
    auth: { user: { name: string; nip: string } };
    submitted: Record<string, string | number> | null;
    masterTasks: MasterTask[];
    checklist: Record<number, ChecklistRecord>;
    tanggal: string;
    areaFilter: string | null;
    areas: string[];
};

const GROUP_ORDER = ['harian', 'mingguan', 'bulanan'] as const;

const groupLabel: Record<string, string> = {
    harian: 'Pekerjaan Harian',
    mingguan: 'Pekerjaan Mingguan',
    bulanan: 'Pekerjaan Bulanan',
};

const groupHeaderClass: Record<string, string> = {
    harian: 'bg-green-50 border-green-200 text-green-800',
    mingguan: 'bg-amber-50 border-amber-200 text-amber-800',
    bulanan: 'bg-blue-50 border-blue-200 text-blue-800',
};

const groupDotClass: Record<string, string> = {
    harian: 'text-green-500',
    mingguan: 'text-amber-500',
    bulanan: 'text-blue-500',
};

export default function FormPekerjaan() {
    const {
        auth, masterTasks, checklist, tanggal, areaFilter, areas,
    } = usePage().props as unknown as PageProps;

    const [selectedDate, setSelectedDate] = useState(tanggal);
    const [activeArea, setActiveArea] = useState(areaFilter ?? '');
    const [areaAlert, setAreaAlert] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const [items, setItems] = useState<ChecklistItem[]>(() =>
        masterTasks.map((task) => ({
            master_pekerjaan_id: task.id,
            tugas: task.nama_pekerjaan,
            status: checklist[task.id]?.status ?? 'belum',
            jenis_pekerjaan: task.jenis_pekerjaan,
        })),
    );

    useEffect(() => {
        setItems(
            masterTasks.map((task) => ({
                master_pekerjaan_id: task.id,
                tugas: task.nama_pekerjaan,
                status: checklist[task.id]?.status ?? 'belum',
                jenis_pekerjaan: task.jenis_pekerjaan,
            })),
        );
    }, [masterTasks, checklist]);

    const scheduleSave = (updated: ChecklistItem[]) => {
        if (debounceRef.current) {
clearTimeout(debounceRef.current);
}

        debounceRef.current = setTimeout(() => {
            router.post(
                baseUrl('/form/checklist-pekerjaan'),
                {
                    _redirect: baseUrl('/form'),
                    nip: auth.user.nip,
                    tanggal: selectedDate,
                    area: activeArea,
                    items: updated.map((item) => ({
                        master_pekerjaan_id: item.master_pekerjaan_id,
                        status: item.status,
                    })),
                },
                { preserveScroll: true, preserveState: true },
            );
        }, 200);
    };

    const toggleStatus = (masterId: number) => {
        if (!activeArea) {
            setAreaAlert(true);

            return;
        }

        setAreaAlert(false);

        setItems((prev) => {
            const updated = prev.map((item) =>
                item.master_pekerjaan_id === masterId
                    ? { ...item, status: item.status === 'sudah' ? 'belum' : 'sudah' }
                    : item,
            );
            scheduleSave(updated);

            return updated;
        });
    };

    const handleAreaSelect = (area: string) => {
        setActiveArea(area);
        setAreaAlert(false);
        router.get(
            baseUrl('/form/pekerjaan'),
            { tanggal: selectedDate, area },
            { preserveState: false, preserveScroll: true },
        );
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        router.get(
            baseUrl('/form/pekerjaan'),
            { tanggal: newDate, area: activeArea || undefined },
            { preserveState: false, preserveScroll: true },
        );
    };

    const grouped: Record<string, ChecklistItem[]> = {};
    let totalFiltered = 0;
    let doneFiltered = 0;

    for (const key of GROUP_ORDER) {
        const groupItems = items
            .filter((item) => item.jenis_pekerjaan === key)
            .sort((a, b) => {
                const ta = masterTasks.find((t) => t.id === a.master_pekerjaan_id);
                const tb = masterTasks.find((t) => t.id === b.master_pekerjaan_id);

                return (ta?.urutan ?? 0) - (tb?.urutan ?? 0);
            });

        grouped[key] = groupItems;
        totalFiltered += groupItems.length;
        doneFiltered += groupItems.filter((i) => i.status === 'sudah').length;
    }

    return (
        <>
            <Head title="Checklist Pekerjaan" />

            <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-linear-to-b from-green-50/50 to-white">
                <div className="flex-1 px-4 pb-28 pt-6">
                    <Heading
                        title="Checklist Pekerjaan"
                        description={`${auth.user.name} — ${auth.user.nip}`}
                    />

                    <div className="mt-6 space-y-5">
                        <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-green-700">
                                <CalendarDays className="h-4 w-4" />
                                Tanggal
                            </div>
                            <input
                                id="tanggal"
                                type="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                className="flex h-12 w-full rounded-xl border border-green-200 bg-transparent px-4 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-green-500 focus-visible:ring-[3px] focus-visible:ring-green-500/20"
                            />
                        </div>

                        <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-green-700">
                                <MapPin className="h-4 w-4" />
                                Pilih Area
                            </div>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                {areas.map((area) => {
                                    const isSelected = activeArea === area;

                                    return (
                                        <button
                                            key={area}
                                            type="button"
                                            onClick={() => handleAreaSelect(area)}
                                            className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all active:scale-95 break-words ${
                                                isSelected
                                                    ? 'border-green-500 bg-green-50 text-green-700 shadow-sm'
                                                    : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-green-200 hover:bg-green-50/50'
                                            }`}
                                        >
                                            {area}
                                        </button>
                                    );
                                })}
                            </div>
                            {areaAlert && (
                                <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-red-600">
                                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
                                    Pilih area terlebih dahulu sebelum mengisi tugas
                                </p>
                            )}
                        </div>

                        {activeArea && (
                            <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm">
                                <span className="text-green-700">Progress:</span>
                                <span className="font-semibold text-green-800">
                                    {doneFiltered} / {totalFiltered} tugas selesai
                                </span>
                            </div>
                        )}

                        {GROUP_ORDER.map((key) => {
                            const groupItems = grouped[key];

                            if (groupItems.length === 0) {
return null;
}

                            return (
                                <div key={key} className="rounded-2xl border border-green-100 bg-white shadow-sm overflow-hidden">
                                    <div className={`border-l-4 px-4 py-3 ${groupHeaderClass[key]}`}>
                                        <div className="flex items-center gap-2">
                                            <Circle className={`size-3 fill-current ${groupDotClass[key]}`} />
                                            <span className="font-semibold text-sm">{groupLabel[key]}</span>
                                            <span className="ml-auto text-xs opacity-70">
                                                {groupItems.filter((i) => i.status === 'sudah').length}/{groupItems.length}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="divide-y divide-green-50">
                                        {groupItems.map((item) => {
                                            const task = masterTasks.find((t) => t.id === item.master_pekerjaan_id);
                                            const checked = item.status === 'sudah';

                                            return (
                                                <label
                                                    key={item.master_pekerjaan_id}
                                                    className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-green-50/50"
                                                >
                                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-medium text-green-700">
                                                        {task?.urutan ?? '-'}
                                                    </span>
                                                    <span className="flex-1 text-sm text-green-900">
                                                        {item.tugas}
                                                    </span>
                                                    <span
                                                        className={`relative flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                                                            checked
                                                                ? 'border-green-500 bg-green-500 text-white'
                                                                : 'border-gray-300 bg-white'
                                                        }`}
                                                    >
                                                        {checked && <CheckCircle2 className="h-4 w-4" />}
                                                    </span>
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        onChange={() => toggleStatus(item.master_pekerjaan_id)}
                                                        className="sr-only"
                                                    />
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="fixed inset-x-0 bottom-0 border-t border-green-100 bg-white/80 px-4 pb-safe pb-3 pt-3 shadow-lg backdrop-blur-md">
                    <div className="mx-auto flex max-w-lg">
                        <Button
                            variant="outline"
                            asChild
                            className="w-full border-green-200 text-sm text-green-700 hover:bg-green-50"
                        >
                            <Link href={baseUrl('/form')} className="flex items-center justify-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}