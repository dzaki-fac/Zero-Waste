import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { ArrowLeft, CalendarDays, CheckCircle2, Circle } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';
import ChecklistProgress from '@/components/checklist-progress';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type MasterTask = {
    id: number;
    nama_pekerjaan: string;
    jenis_pekerjaan: string;
    urutan: number;
};

type ChecklistRecord = {
    id: number;
    status: 'sudah' | 'belum';
    area: string | null;
};

type ChecklistItem = {
    master_pekerjaan_id: number;
    tugas: string;
    status: 'sudah' | 'belum';
    jenis_pekerjaan: string;
};

type ProgressItem = {
    total: number;
    selesai: number;
    persentase: number;
    periode: string;
};

type ProgressData = {
    harian: ProgressItem;
    mingguan: ProgressItem;
    bulanan: ProgressItem;
};

type Props = {
    petugas: {
        id: number;
        name: string;
        nip: string | null;
    };
    tanggal: string;
    masterTasks: MasterTask[];
    checklist: Record<number, ChecklistRecord>;
    filter: string | null;
    areaFilter: string | null;
    areas: string[];
    readOnly?: boolean;
    progress: ProgressData;
};

const GROUP_ORDER = ['harian', 'mingguan', 'bulanan'] as const;

const groupLabel: Record<string, string> = {
    harian: 'Pekerjaan Harian',
    mingguan: 'Pekerjaan Mingguan',
    bulanan: 'Pekerjaan Bulanan',
};

const jenisLabel = (val: string) => {
    switch (val) {
        case 'harian': return 'Harian';
        case 'mingguan': return 'Mingguan';
        case 'bulanan': return 'Bulanan';
        default: {
            const s = val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();

            if (s === 'Harian' || s === 'Mingguan' || s === 'Bulanan') {
return s;
}

            return 'Tidak Diketahui';
        }
    }
};

const jenisBadgeClass: Record<string, string> = {
    Harian: 'bg-green-50 text-green-700 border-green-200',
    Mingguan: 'bg-amber-50 text-amber-700 border-amber-200',
    Bulanan: 'bg-blue-50 text-blue-700 border-blue-200',
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

const FILTERS = [
    { value: null as string | null, label: 'Semua Pekerjaan' },
    { value: 'harian', label: 'Harian' },
    { value: 'mingguan', label: 'Mingguan' },
    { value: 'bulanan', label: 'Bulanan' },
];

const COLGROUP = (
    <colgroup>
        <col className="w-[48px]" />
        <col />
        <col className="w-[140px]" />
        <col className="w-[150px]" />
        <col className="w-[80px]" />
    </colgroup>
);

export default function ChecklistPekerjaanShow({ petugas, tanggal, masterTasks, checklist, filter, areaFilter, areas, readOnly = false, progress }: Props) {
    const dateInputRef = useRef<HTMLInputElement>(null);
    const [selectedDate, setSelectedDate] = useState(tanggal);
    const [activeFilter, setActiveFilter] = useState<string | null>(filter);
    const [activeArea, setActiveArea] = useState<string>(areaFilter ?? '');
    const [areaAlert, setAreaAlert] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const activeAreaRef = useRef(activeArea);
    const selectedDateRef = useRef(selectedDate);
    const petugasNipRef = useRef(petugas.nip);

    const baseUrl = readOnly ? route('petugas.checklist-pekerjaan.index') : route('admin.checklist-pekerjaan.show', { checklist_pekerjaan: petugas.nip });
    const backUrl = readOnly ? route('petugas.dashboard') : route('admin.checklist-pekerjaan.index');

    useEffect(() => {
        activeAreaRef.current = activeArea;
    }, [activeArea]);

    useEffect(() => {
        selectedDateRef.current = selectedDate;
    }, [selectedDate]);

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

    const areaSelected = activeArea !== '';

    const doSave = useCallback((updated: ChecklistItem[]) => {
        const area = activeAreaRef.current;
        const date = selectedDateRef.current;
        const nip = petugasNipRef.current;

        if (!area || !nip) {
return;
}

        router.post(
            route('admin.checklist-pekerjaan.index'),
            {
                nip,
                tanggal: date,
                area,
                items: updated.map((item) => ({
                    master_pekerjaan_id: item.master_pekerjaan_id,
                    status: item.status,
                })),
            },
            { preserveScroll: true, preserveState: true },
        );
    }, []);

    const scheduleSave = useCallback((updated: ChecklistItem[]) => {
        if (debounceRef.current) {
clearTimeout(debounceRef.current);
}

        debounceRef.current = setTimeout(() => {
            doSave(updated);
        }, 200);
    }, [doSave]);

    const toggleStatus = (masterId: number) => {
        if (!areaSelected) {
            setAreaAlert(true);

            return;
        }

        setItems((prev) => {
            const updated = prev.map((item) =>
                item.master_pekerjaan_id === masterId
                    ? { ...item, status: item.status === 'sudah' ? 'belum' as const : 'sudah' as const }
                    : item,
            );
            scheduleSave(updated);

            return updated;
        });
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);

        if (readOnly) {
            router.get(
                baseUrl,
                { tanggal: newDate, jenis: activeFilter ?? undefined, area: activeArea || undefined },
                { preserveState: false, preserveScroll: true },
            );

            return;
        }

        if (!petugas.nip) {
return;
}

        router.get(
            route('admin.checklist-pekerjaan.show', { checklist_pekerjaan: petugas.nip }),
            { tanggal: newDate, jenis: activeFilter ?? undefined, area: activeArea || undefined },
            {
                preserveState: false,
                preserveScroll: true,
            },
        );
    };

    const handleFilterChange = (value: string | null) => {
        setActiveFilter(value);

        if (readOnly) {
            router.get(
                baseUrl,
                { tanggal: selectedDate, jenis: value ?? undefined, area: activeArea || undefined },
                { preserveState: true, preserveScroll: true },
            );

            return;
        }

        if (!petugas.nip) {
return;
}

        router.get(
            route('admin.checklist-pekerjaan.show', { checklist_pekerjaan: petugas.nip }),
            { tanggal: selectedDate, jenis: value ?? undefined, area: activeArea || undefined },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleAreaChange = (value: string) => {
        setActiveArea(value);
        setAreaAlert(false);

        if (readOnly) {
            router.get(
                baseUrl,
                { tanggal: selectedDate, jenis: activeFilter ?? undefined, area: value || undefined },
                { preserveState: false, preserveScroll: true },
            );

            return;
        }

        if (!petugas.nip) {
return;
}

        router.get(
            route('admin.checklist-pekerjaan.show', { checklist_pekerjaan: petugas.nip }),
            { tanggal: selectedDate, jenis: activeFilter ?? undefined, area: value || undefined },
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
                const ua = ta?.urutan ?? 0;
                const ub = tb?.urutan ?? 0;

                return ua - ub || a.master_pekerjaan_id - b.master_pekerjaan_id;
            });

        if (activeFilter === null || activeFilter === key) {
            grouped[key] = groupItems;
            totalFiltered += groupItems.length;
            doneFiltered += groupItems.filter((i) => i.status === 'sudah').length;
        } else {
            grouped[key] = [];
        }
    }

    const allTotal = items.length;

    const counterText = () => {
        if (!activeFilter) {
return `${doneFiltered} / ${totalFiltered}`;
}

        const label = jenisLabel(activeFilter);

        return `${doneFiltered} / ${totalFiltered} ${label}`;
    };

    return (
        <>
            <Head title={`Checklist - ${petugas.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title={`Checklist Pekerjaan - ${petugas.name}`}
                        description={`NIP: ${petugas.nip ?? '-'}`}
                    />
                    <Button variant="outline" asChild className="border-green-200 text-green-700 hover:bg-green-50">
                        <Link href={backUrl} className="flex items-center gap-1">
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                </div>

                <ChecklistProgress progress={progress} />

                <div className="flex flex-wrap items-end gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="tanggal" className="text-green-700">Tanggal</Label>
                        <div
                            className="relative cursor-pointer"
                            onClick={() => {
                                dateInputRef.current?.focus();
                                dateInputRef.current?.showPicker();
                            }}
                        >
                            <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-400 pointer-events-none" />
                            <input
                                ref={dateInputRef}
                                id="tanggal"
                                type="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                onKeyDown={(e) => e.key !== 'Tab' && e.preventDefault()}
                                onPaste={(e) => e.preventDefault()}
                                onDrop={(e) => e.preventDefault()}
                                className="flex h-9 w-full min-w-0 rounded-md border border-green-200 bg-transparent px-3 py-1 pl-9 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-green-500 focus-visible:ring-[3px] focus-visible:ring-green-500/20 md:text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <span className="text-sm font-medium text-green-700">Filter Jenis Pekerjaan</span>
                        <div className="inline-flex overflow-hidden rounded-xl border border-green-200 bg-white shadow-sm">
                            {FILTERS.map((f) => (
                                <button
                                    key={f.value ?? 'all'}
                                    type="button"
                                    onClick={() => handleFilterChange(f.value)}
                                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                                        activeFilter === f.value
                                            ? 'bg-green-600 text-white'
                                            : 'text-green-700 hover:bg-green-50'
                                    }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <span className="text-sm font-medium text-green-700">Area</span>
                        <select
                            value={activeArea}
                            onChange={(e) => handleAreaChange(e.target.value)}
                            className="h-9 rounded-md border border-green-200 bg-white px-3 text-sm text-green-700 shadow-sm transition-[color,box-shadow] outline-none focus-visible:border-green-500 focus-visible:ring-[3px] focus-visible:ring-green-500/20"
                        >
                            <option value="">Pilih Area</option>
                            {areas.map((area) => (
                                <option key={area} value={area}>{area}</option>
                            ))}
                        </select>
                        {areaAlert && (
                            <p className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
                                Pilih area terlebih dahulu sebelum mengisi tugas
                            </p>
                        )}
                    </div>

                    <div className={`rounded-lg border px-4 py-2 text-sm ${areaSelected ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-100'}`}>
                        <span className={areaSelected ? 'text-green-600' : 'text-gray-400'}>Sudah dikerjakan: </span>
                        <span className={`font-semibold ${areaSelected ? 'text-green-800' : 'text-gray-400'}`}>
                            {areaSelected ? counterText() : 'pilih area'}
                        </span>
                    </div>
                </div>

                {GROUP_ORDER.map((key) => {
                    const groupItems = grouped[key];

                    if (groupItems.length === 0 && activeFilter !== null && activeFilter !== key) {
return null;
}

                    if (groupItems.length === 0) {
                        return (
                            <div key={key} className="rounded-xl border border-green-200 bg-white shadow-sm overflow-hidden">
                                <div className={`border-l-4 px-4 py-3 ${groupHeaderClass[key]}`}>
                                    <div className="flex items-center gap-2">
                                        <Circle className={`size-3 fill-current ${groupDotClass[key]}`} />
                                        <span className="font-semibold">{groupLabel[key]}</span>
                                    </div>
                                </div>
                                <div className="p-8 text-center text-sm text-green-600/70">
                                    Belum ada pekerjaan {key}{activeArea ? ` di area "${activeArea}"` : ''}.
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={key} className="rounded-xl border border-green-200 bg-white shadow-sm overflow-hidden">
                            <div className={`border-l-4 px-4 py-3 ${groupHeaderClass[key]}`}>
                                <div className="flex items-center gap-2">
                                    <Circle className={`size-3 fill-current ${groupDotClass[key]}`} />
                                    <span className="font-semibold">{groupLabel[key]}</span>
                                    <span className="ml-auto text-sm opacity-70">
                                        {groupItems.filter((i) => i.status === 'sudah').length} / {groupItems.length} selesai
                                    </span>
                                </div>
                            </div>

                            {/* ---------- Desktop table ---------- */}
                            <div className="hidden md:block">
                                <div className="overflow-x-auto">
                                    <Table className="min-w-[850px]">
                                        {COLGROUP}
                                        <TableHeader>
                                            <TableRow className="border-green-100 bg-green-50/30">
                                                <TableHead className="text-green-700">No</TableHead>
                                                <TableHead className="text-green-700">Tugas</TableHead>
                                                <TableHead className="text-green-700">Area</TableHead>
                                                <TableHead className="text-green-700 text-center">Jenis Pekerjaan</TableHead>
                                                <TableHead className="text-green-700 text-center">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {groupItems.map((item) => {
                                                const task = masterTasks.find((t) => t.id === item.master_pekerjaan_id);

                                                return (
                                                    <TableRow key={item.master_pekerjaan_id} className="border-green-100">
                                                        <TableCell className="align-top pt-4">
                                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-medium text-green-700">
                                                                {task?.urutan ?? '-'}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="align-top pt-4 text-sm text-green-900 whitespace-normal break-words">
                                                            {item.tugas}
                                                        </TableCell>
                                                        <TableCell className="align-top pt-4 text-sm text-green-600">
                                                            {activeArea || '-'}
                                                        </TableCell>
                                                        <TableCell className="align-top pt-4 text-center">
                                                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium min-w-[90px] justify-center ${jenisBadgeClass[jenisLabel(item.jenis_pekerjaan)] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                                                <span className={`h-1.5 w-1.5 rounded-full ${jenisLabel(item.jenis_pekerjaan) === 'Tidak Diketahui' ? 'bg-gray-400' : 'bg-current'}`} />
                                                                {jenisLabel(item.jenis_pekerjaan)}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="align-top pt-3 text-center">
                                                            {readOnly ? (
                                                                <div
                                                                    role="checkbox"
                                                                    aria-checked={item.status === 'sudah'}
                                                                    aria-readonly="true"
                                                                    className={`mx-auto flex h-7 w-7 items-center justify-center rounded-md border ${
                                                                        item.status === 'sudah'
                                                                            ? 'border-green-600 bg-green-600'
                                                                            : 'border-gray-300 bg-gray-100'
                                                                    }`}
                                                                >
                                                                    {item.status === 'sudah' && <CheckCircle2 className="h-5 w-5 text-white" />}
                                                                </div>
                                                            ) : (
                                                                <label className="inline-flex cursor-pointer items-center justify-center">
                                                                    <span className={`relative flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                                                                        !areaSelected
                                                                            ? 'border-gray-200 bg-gray-100'
                                                                            : item.status === 'sudah'
                                                                                ? 'border-green-500 bg-green-500 text-white'
                                                                                : 'border-gray-300 bg-white hover:border-gray-400'
                                                                    }`}>
                                                                        {item.status === 'sudah' && <CheckCircle2 className="h-3.5 w-3.5" />}
                                                                    </span>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={item.status === 'sudah'}
                                                                        onChange={() => toggleStatus(item.master_pekerjaan_id)}
                                                                        className="sr-only"
                                                                    />
                                                                </label>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            {/* ---------- Mobile card list ---------- */}
                            <div className="block md:hidden divide-y divide-green-50">
                                {groupItems.map((item) => {
                                    const task = masterTasks.find((t) => t.id === item.master_pekerjaan_id);

                                    return (
                                        <div key={item.master_pekerjaan_id} className="px-4 py-3">
                                            <div className="flex items-start gap-3">
                                                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-medium text-green-700">
                                                    {task?.urutan ?? '-'}
                                                </span>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                                        <span className="text-sm font-medium text-green-900">
                                                            {item.tugas}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${jenisBadgeClass[jenisLabel(item.jenis_pekerjaan)] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                                            <span className={`h-1.5 w-1.5 rounded-full ${jenisLabel(item.jenis_pekerjaan) === 'Tidak Diketahui' ? 'bg-gray-400' : 'bg-current'}`} />
                                                            {jenisLabel(item.jenis_pekerjaan)}
                                                        </span>
                                                        <span className="text-xs text-green-600">
                                                            {activeArea || '-'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="shrink-0 pt-0.5">
                                                    {readOnly ? (
                                                        <div
                                                            role="checkbox"
                                                            aria-checked={item.status === 'sudah'}
                                                            aria-readonly="true"
                                                            className={`flex h-7 w-7 items-center justify-center rounded-md border ${
                                                                item.status === 'sudah'
                                                                    ? 'border-green-600 bg-green-600'
                                                                    : 'border-gray-300 bg-gray-100'
                                                            }`}
                                                        >
                                                            {item.status === 'sudah' && <CheckCircle2 className="h-5 w-5 text-white" />}
                                                        </div>
                                                    ) : (
                                                        <label className="inline-flex cursor-pointer items-center justify-center">
                                                            <span className={`relative flex h-7 w-7 items-center justify-center rounded-md border-2 transition-colors ${
                                                                !areaSelected
                                                                    ? 'border-gray-200 bg-gray-100'
                                                                    : item.status === 'sudah'
                                                                        ? 'border-green-500 bg-green-500 text-white'
                                                                        : 'border-gray-300 bg-white hover:border-gray-400'
                                                            }`}>
                                                                {item.status === 'sudah' && <CheckCircle2 className="h-4 w-4" />}
                                                            </span>
                                                            <input
                                                                type="checkbox"
                                                                checked={item.status === 'sudah'}
                                                                onChange={() => toggleStatus(item.master_pekerjaan_id)}
                                                                className="sr-only"
                                                            />
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
