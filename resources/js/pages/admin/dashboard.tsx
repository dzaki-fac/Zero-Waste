import { Head, Link, router, usePage } from '@inertiajs/react';
import { Scale, Recycle, Truck, Users, CalendarIcon, Clock, Package, CheckCircle, ChevronLeft, ChevronRight, Send, Leaf } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import ChecklistProgress from '@/components/checklist-progress';
import NativeDatePicker from '@/components/native-date-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Auth } from '@/types';

type ChartData = {
    name: string;
    value: number;
}[];

type ActivityStat = {
    jumlah: number;
    total_berat: number;
};

type PetugasStat = {
    name: string;
    penimbangan: ActivityStat;
    pilah_sampah: ActivityStat;
    distribusi: ActivityStat;
};

type JenisSampahItem = {
    kategori: string;
    berat: number | string;
    periode: 'hari' | 'minggu';
};

type DataDasarType = {
    id: number | null;
    nama_tim: string;
    fakultas: string;
    alamat: string | null;
    penanggung_jawab: string;
    nomor_hp_email: string;
    tanggal_pengisian: string;
    jumlah_mahasiswa: number;
    jumlah_dosen: number;
    jumlah_tendik: number;
    jumlah_tenaga_pendukung: number;
    total_warga: number;
    luas_area_fakultas: number;
    luas_area_objek_lomba: number;
    baseline_sampah: number;
    baseline_sampah_periode: 'hari' | 'minggu';
    jenis_sampah_dominan: JenisSampahItem[];
    kondisi_fasilitas: string | null;
    sampah_residu_akhir: number;
    total_sampah_terkelola: number;
    jumlah_warga_terlibat_aktif: number;
    luas_area_zero_waste: number;
};

type RincianAreaDetail = {
    nama: string;
    deskripsi: string;
    luas: number;
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

type PageProps = {
    dataDasar: DataDasarType | null;
    rincianArea: RincianAreaDetail[];
    penimbanganByArea: ChartData;
    pilahByJenis: ChartData;
    distribusiByTujuan: ChartData;
    petugasStats: PetugasStat[];
    statusBerat: {
        menunggu_pemilahan: number;
        siap_didistribusikan: number;
        sudah_didistribusikan: number;
    };
    siapDidistribusikanByJenis: ChartData;
    progress: ProgressData;
    progressPetugasNip: string | null;
    progressDate: string;
    petugasList: { id: number; name: string; nip: string }[];
    filters: {
        start_date: string | null;
        end_date: string | null;
    };
};

const BAR_COLORS = {
    penimbangan: '#22c55e',
    pilah_sampah: '#3b82f6',
    distribusi: '#f59e0b',
};

type ActivityKey = keyof typeof BAR_COLORS;

const COLORS = [
    '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d',
    '#86efac', '#4ade80', '#a3e635', '#facc15', '#fb923c',
    '#f87171',
];

const categoryColorMap = new Map<string, string>();
function getCategoryColor(name: string): string {
    let color = categoryColorMap.get(name);

    if (!color) {
        color = COLORS[categoryColorMap.size % COLORS.length];
        categoryColorMap.set(name, color);
    }

    return color;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { percent?: number } }> }) {
    if (active && payload && payload.length) {
        const data = payload[0];

        return (
            <div className="rounded-lg border bg-white px-3 py-2 shadow-md">
                <p className="text-sm font-medium text-gray-900">{data.name}</p>
                <p className="text-xs text-gray-600">
                    {data.value.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg
                </p>
            </div>
        );
    }

    return null;
}

function renderCustomLabel(props: PieLabelRenderProps) {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;

    if (typeof percent !== 'number' || percent < 0.05) {
return null;
}

    if (typeof cx !== 'number' || typeof cy !== 'number' || typeof midAngle !== 'number' || typeof innerRadius !== 'number' || typeof outerRadius !== 'number') {
return null;
}

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" filter="url(#pieLabelShadow)" textAnchor="middle" dominantBaseline="central" className="text-xs font-medium">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
}

function PieChartCard({ title, icon: Icon, data, totalLabel, legendPosition = 'bottom' }: {
    title: string; icon: React.ComponentType<{ className?: string }>; data: ChartData; totalLabel: string;
    legendPosition?: 'bottom' | 'right';
}) {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const sortedData = data.slice().sort((a, b) => b.value - a.value);

    return (
        <Card className="border-green-200">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base text-green-900">
                    <Icon className="size-5 text-green-600" />
                    {title}
                </CardTitle>
                <p className="text-xs text-green-700">
                    {totalLabel}: {total.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg
                </p>
            </CardHeader>
            <CardContent>
                {data.length > 0 ? (
                    legendPosition === 'right' ? (
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                            <div className="h-[240px] shrink-0 lg:w-1/2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <defs>
                                            <filter id="pieLabelShadow" x="-50%" y="-50%" width="200%" height="200%">
                                                <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#000000" floodOpacity="0.65" />
                                            </filter>
                                        </defs>
                                        <Pie
                                            data={sortedData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={renderCustomLabel}
                                            outerRadius={110}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {sortedData.map((entry) => (
                                                <Cell key={`cell-${entry.name}`} fill={getCategoryColor(entry.name)} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="w-full space-y-2 lg:pl-4">
                                {data
                                    .slice()
                                    .sort((a, b) => b.value - a.value)
                                    .map((item) => {
                                        const percent = total > 0 ? (item.value / total) * 100 : 0;

                                        return (
                                            <div key={item.name}>
                                                <div className="flex items-start gap-2">
                                                    <span
                                                        className="mt-1 size-2.5 shrink-0 rounded-full"
                                                        style={{ backgroundColor: getCategoryColor(item.name) }}
                                                    />
                                                    <span className="min-w-0 text-xs text-gray-700 leading-snug break-words">
                                                        {item.name}
                                                    </span>
                                                </div>
                                                <div className="ml-4.5 flex items-baseline gap-1.5">
                                                    <span className="text-xs font-medium tabular-nums text-gray-900">
                                                        {item.value.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg
                                                    </span>
                                                    <span className="text-xs tabular-nums text-gray-500">
                                                        ({percent.toFixed(1)}%)
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="h-75">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <defs>
                                            <filter id="pieLabelShadow" x="-50%" y="-50%" width="200%" height="200%">
                                                <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#000000" floodOpacity="0.65" />
                                            </filter>
                                        </defs>
                                        <Pie
                                            data={sortedData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={renderCustomLabel}
                                            outerRadius={110}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {sortedData.map((entry) => (
                                                <Cell key={`cell-${entry.name}`} fill={getCategoryColor(entry.name)} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            {data.length > 0 && (
                                <div className="mt-2 space-y-2">
                                    {data
                                        .slice()
                                        .sort((a, b) => b.value - a.value)
                                        .map((item) => {
                                            const percent = total > 0 ? (item.value / total) * 100 : 0;

                                            return (
                                                <div key={item.name}>
                                                    <div className="flex items-start gap-2">
                                                        <span
                                                            className="mt-1 size-2.5 shrink-0 rounded-full"
                                                            style={{ backgroundColor: getCategoryColor(item.name) }}
                                                        />
                                                        <span className="min-w-0 text-xs text-gray-700 leading-snug break-words">
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4.5 flex items-baseline gap-1.5">
                                                        <span className="text-xs font-medium tabular-nums text-gray-900">
                                                            {item.value.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg
                                                        </span>
                                                        <span className="text-xs tabular-nums text-gray-500">
                                                            ({percent.toFixed(1)}%)
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            )}
                        </>
                    )
                ) : (
                    <div className="flex h-75 items-center justify-center text-sm text-gray-400">
                        Belum ada data
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

type PresetKey = 'all' | 'today' | '7d' | '30d' | '3m';

const PRESETS: { key: PresetKey; label: string; days: number | null }[] = [
    { key: 'all', label: 'Semua', days: null },
    { key: 'today', label: 'Hari Ini', days: 0 },
    { key: '7d', label: '7 Hari', days: 7 },
    { key: '30d', label: '30 Hari', days: 30 },
    { key: '3m', label: '3 Bulan', days: 90 },
];

function getPresetKey(start: string | null, end: string | null): PresetKey {
    if (!start && !end) {
return 'all';
}

    if (start && end) {
        if (start === end) {
return 'today';
}

        const diff = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000);

        if (diff === 6) {
return '7d';
}

        if (diff === 29) {
return '30d';
}

        if (diff === 89) {
return '3m';
}
    }

    return 'all';
}

function formatDateInput(d: Date): string {
    return d.toISOString().split('T')[0];
}

function formatDisplayDate(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00');
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();

    return `${dd}/${mm}/${yyyy}`;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function daysAgo(n: number): string {
    const d = new Date();
    d.setDate(d.getDate() - n);

    return formatDateInput(d);
}

function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

function SimpleDatePicker({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const initial = value ? new Date(value + 'T00:00:00') : new Date();
    const [viewMonth, setViewMonth] = useState(initial.getMonth());
    const [viewYear, setViewYear] = useState(initial.getFullYear());
    const [inputValue, setInputValue] = useState(value ? formatDisplayDate(value) : '');
    const [typing, setTyping] = useState(false);

    useEffect(() => {
        if (!typing) {
            setInputValue(value ? formatDisplayDate(value) : '');
        }
    }, [value, typing]);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
                setTyping(false);
                setInputValue(value ? formatDisplayDate(value) : '');
            }
        }
        document.addEventListener('mousedown', handleClick);

        return () => document.removeEventListener('mousedown', handleClick);
    }, [value]);

    useEffect(() => {
        if (open && value) {
            const d = new Date(value + 'T00:00:00');
            setViewMonth(d.getMonth());
            setViewYear(d.getFullYear());
        }
    }, [open, value]);

    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const days: (number | null)[] = [
        ...Array(firstDay).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    const WEEK_DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    function prevMonth() {
        if (viewMonth === 0) {
 setViewMonth(11); setViewYear(viewYear - 1); 
} else {
setViewMonth(viewMonth - 1);
}
    }

    function nextMonth() {
        if (viewMonth === 11) {
 setViewMonth(0); setViewYear(viewYear + 1); 
} else {
setViewMonth(viewMonth + 1);
}
    }

    function selectDay(day: number) {
        const mm = String(viewMonth + 1).padStart(2, '0');
        const dd = String(day).padStart(2, '0');
        const result = `${viewYear}-${mm}-${dd}`;
        onChange(result);
        setInputValue(formatDisplayDate(result));
        setTyping(false);
        setOpen(false);
    }

    function parseTypedInput(raw: string): string | null {
        const cleaned = raw.trim().replace(/[/\.]/g, '-');
        const mdy = cleaned.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);

        if (mdy) {
            const d = new Date(Number(mdy[3]), Number(mdy[2]) - 1, Number(mdy[1]));

            if (!isNaN(d.getTime())) {
return formatDateInput(d);
}
        }

        const iso = cleaned.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);

        if (iso) {
            const d = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));

            if (!isNaN(d.getTime())) {
return formatDateInput(d);
}
        }

        return null;
    }

    function commitTypedValue() {
        const parsed = parseTypedInput(inputValue);

        if (parsed) {
            onChange(parsed);
            setInputValue(formatDisplayDate(parsed));
        } else {
            setInputValue(value ? formatDisplayDate(value) : '');
        }

        setTyping(false);
    }

    return (
        <div ref={ref} className="relative">
            <input
                type="text"
                value={typing ? inputValue : (value ? formatDisplayDate(value) : '')}
                placeholder={placeholder ?? 'tt/bb/tttt'}
                onFocus={() => {
 setOpen(true); setTyping(true); setInputValue(value ? formatDisplayDate(value) : ''); 
}}
                onChange={(e) => {
 setInputValue(e.target.value); setTyping(true); 
}}
                onKeyDown={(e) => {
 if (e.key === 'Enter') {
 e.preventDefault(); commitTypedValue(); setOpen(false); 
}

 if (e.key === 'Escape') {
 setInputValue(value ? formatDisplayDate(value) : ''); setTyping(false); setOpen(false); 
} 
}}
                onBlur={() => {
 if (typing) {
commitTypedValue();
} 
}}
                className="w-32.5 border-0 bg-transparent text-xs text-gray-700 outline-none hover:text-gray-900 cursor-text placeholder:text-gray-400"
            />
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onMouseDown={(e) => {
 if (e.target === e.currentTarget) {
 commitTypedValue(); setOpen(false); 
} 
}}>
                    <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-5 shadow-2xl">
                        <div className="mb-4 flex items-center justify-between">
                            <button type="button" onClick={prevMonth} className="rounded-lg p-2 hover:bg-gray-100">
                                <ChevronLeft className="size-5" />
                            </button>
                            <span className="text-base font-semibold text-gray-800">
                                {MONTH_NAMES[viewMonth]} {viewYear}
                            </span>
                            <button type="button" onClick={nextMonth} className="rounded-lg p-2 hover:bg-gray-100">
                                <ChevronRight className="size-5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {WEEK_DAYS.map((d) => (
                                <div key={d} className="py-2 text-center text-xs font-medium text-gray-400">{d}</div>
                            ))}
                            {days.map((day, i) =>
                                day === null ? <div key={`e${i}`} /> : (
                                    <button
                                        type="button"
                                        key={day}
                                        onClick={() => selectDay(day)}
                                        className={`h-10 rounded-lg text-sm font-medium transition-colors ${
                                            value === `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                                                ? 'bg-green-600 text-white shadow'
                                                : 'hover:bg-green-50 text-gray-700'
                                        }`}
                                    >
                                        {day}
                                    </button>
                                )
                            )}
                        </div>
                        <div className="mt-4 flex justify-center">
                            <button type="button" onClick={() => {
 commitTypedValue(); setOpen(false); 
}} className="rounded-lg bg-gray-100 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200">
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ReadField({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="grid gap-0.5">
            <span className="text-xs font-medium text-green-700">{label}</span>
            <span className="text-sm text-green-900">
                {value || <span className="text-slate-400 italic">Belum diisi</span>}
            </span>
        </div>
    );
}

function DataDasarSummary({ dataDasar, rincianArea }: { dataDasar: DataDasarType | null; rincianArea: RincianAreaDetail[] }) {
    if (!dataDasar) {
        return (
            <Card className="border-green-200">
                <CardContent className="py-8 text-center text-sm text-gray-400">
                    Data dasar belum diisi.
                </CardContent>
            </Card>
        );
    }

    const formattedTanggal = dataDasar.tanggal_pengisian
        ? new Date(dataDasar.tanggal_pengisian + 'T00:00:00').toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          })
        : '';

    const baselineSampah = dataDasar.baseline_sampah || 0;
    const sampahResidu = dataDasar.sampah_residu_akhir || 0;
    const totalSampahTerkelola = dataDasar.total_sampah_terkelola || 0;
    const jumlahWargaTerlibat = dataDasar.jumlah_warga_terlibat_aktif || 0;
    const luasAreaZeroWaste = dataDasar.luas_area_zero_waste || 0;
    const luasAreaFakultas = dataDasar.luas_area_fakultas || 0;
    const totalWarga = dataDasar.total_warga || 0;

    const hasilPenguranganSampah = baselineSampah ? ((baselineSampah - sampahResidu) / baselineSampah) * 100 : null;
    const hasilSampahPerKapita = totalWarga ? totalSampahTerkelola / totalWarga : null;
    const hasilPartisipasi = totalWarga ? (jumlahWargaTerlibat / totalWarga) * 100 : null;
    const hasilCakupanArea = luasAreaFakultas ? (luasAreaZeroWaste / luasAreaFakultas) * 100 : null;

    return (
        <Card className="border-green-200">
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-green-900">
                            <Leaf className="size-4 text-green-600 shrink-0" />
                            Data Dasar
                        </h4>
                        <p className="text-xs text-green-700">
                            Informasi dasar unit/fakultas sebagai baseline program Zero Waste
                        </p>
                    </div>
                    <div className="shrink-0 text-right">
                        <h4 className="flex items-center justify-end gap-2 text-sm font-semibold text-green-900">
                            Indikator Zero Waste
                            <Leaf className="size-4 text-green-600 shrink-0" />
                        </h4>
                        <p className="text-[11px] text-green-700">
                            Indikator dan hasil penilaian program Zero Waste
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-5">
                <div className="flex flex-col gap-4 lg:flex-row">
                    {/* Identitas */}
                    <div className="grid grid-cols-1 gap-4 rounded-lg border border-green-100 bg-green-50/30 p-4 sm:grid-cols-2 lg:w-2/3 lg:grid-cols-3 lg:grid-rows-2">
                        <ReadField label="Nama Tim / Unit" value={dataDasar.nama_tim} />
                        <ReadField label="Fakultas / Unit" value={dataDasar.fakultas} />
                        <ReadField label="Alamat / Lokasi Program" value={dataDasar.alamat} />
                        <ReadField label="Penanggung Jawab" value={dataDasar.penanggung_jawab} />
                        <ReadField label="Nomor HP / Email" value={dataDasar.nomor_hp_email} />
                        <ReadField label="Tanggal Pengisian" value={formattedTanggal} />
                    </div>
                    {/* Rumus Penilaian */}
                    <div className="overflow-hidden rounded-lg border border-green-100 lg:w-1/3">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-green-100 bg-green-50/30">
                                    <th className="px-3 py-2 text-left text-xs font-semibold tracking-wide text-green-700 uppercase">Indikator</th>
                                    <th className="px-3 py-2 text-right text-xs font-semibold tracking-wide text-green-700 uppercase">Hasil</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-green-100">
                                <tr>
                                    <td className="px-3 py-2 text-xs text-green-800">Persentase Pengurangan Sampah</td>
                                    <td className="px-3 py-2 text-right text-xs tabular-nums font-medium text-green-900">
                                        {hasilPenguranganSampah !== null ? `${hasilPenguranganSampah.toFixed(2)}%` : '-'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-3 py-2 text-xs text-green-800">Sampah Terkelola per Kapita</td>
                                    <td className="px-3 py-2 text-right text-xs tabular-nums font-medium text-green-900">
                                        {hasilSampahPerKapita !== null ? `${hasilSampahPerKapita.toFixed(2)} kg/orang` : '-'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-3 py-2 text-xs text-green-800">Persentase Partisipasi</td>
                                    <td className="px-3 py-2 text-right text-xs tabular-nums font-medium text-green-900">
                                        {hasilPartisipasi !== null ? `${hasilPartisipasi.toFixed(2)}%` : '-'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-3 py-2 text-xs text-green-800">Cakupan Area Terkelola</td>
                                    <td className="px-3 py-2 text-right text-xs tabular-nums font-medium text-green-900">
                                        {hasilCakupanArea !== null ? `${hasilCakupanArea.toFixed(2)}%` : '-'}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
                    {/* Tabel 1: Data Warga */}
                    <div className="overflow-hidden rounded-lg border border-green-100">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-green-50/60">
                                    <th className="px-3 py-2 text-left text-xs font-semibold tracking-wide text-green-700 uppercase">Data</th>
                                    <th className="px-3 py-2 text-right text-xs font-semibold tracking-wide text-green-700 uppercase">Nilai</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-green-100">
                                <tr>
                                    <td className="px-3 py-2 text-green-800">Jumlah Mahasiswa</td>
                                    <td className="px-3 py-2 text-right tabular-nums text-green-900">
                                        {dataDasar.jumlah_mahasiswa.toLocaleString('id-ID')} orang
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-3 py-2 text-green-800">Jumlah Dosen</td>
                                    <td className="px-3 py-2 text-right tabular-nums text-green-900">
                                        {dataDasar.jumlah_dosen.toLocaleString('id-ID')} orang
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-3 py-2 text-green-800">Jumlah Tenaga Kependidikan</td>
                                    <td className="px-3 py-2 text-right tabular-nums text-green-900">
                                        {dataDasar.jumlah_tendik.toLocaleString('id-ID')} orang
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-3 py-2 text-green-800">Jumlah Tenaga Pendukung</td>
                                    <td className="px-3 py-2 text-right tabular-nums text-green-900">
                                        {dataDasar.jumlah_tenaga_pendukung.toLocaleString('id-ID')} orang
                                    </td>
                                </tr>
                                <tr className="bg-green-50/40">
                                    <td className="px-3 py-2 font-semibold text-green-900">Total Warga</td>
                                    <td className="px-3 py-2 text-right font-semibold tabular-nums text-green-900">
                                        {dataDasar.total_warga.toLocaleString('id-ID')} orang
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Tabel 2: Rincian Luas Area */}
                    <div className="overflow-hidden rounded-lg border border-green-100">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-green-50/60">
                                    <th className="px-3 py-2 text-left text-xs font-semibold tracking-wide text-green-700 uppercase">Area</th>
                                    <th className="px-3 py-2 text-right text-xs font-semibold tracking-wide text-green-700 uppercase">Luas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-green-100">
                                {rincianArea.map((item) => (
                                    <tr key={item.nama}>
                                        <td className="px-3 py-2 text-green-800">{item.nama}</td>
                                        <td className="px-3 py-2 text-right tabular-nums text-green-900">
                                            {item.luas.toLocaleString('id-ID')} m&sup2;
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-green-50/40">
                                    <td className="px-3 py-2 font-semibold text-green-900">Total Luas Area</td>
                                    <td className="px-3 py-2 text-right font-semibold tabular-nums text-green-900">
                                        {rincianArea.reduce((s, i) => s + (i.luas || 0), 0).toLocaleString('id-ID')} m&sup2;
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Tabel 3: Data Sampah */}
                    <div className="overflow-hidden rounded-lg border border-green-100">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-green-50/60">
                                    <th className="px-3 py-2 text-left text-xs font-semibold tracking-wide text-green-700 uppercase">Data</th>
                                    <th className="px-3 py-2 text-right text-xs font-semibold tracking-wide text-green-700 uppercase">Nilai</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-green-100">
                                <tr>
                                    <td className="px-3 py-2 text-green-800">Baseline Sampah Awal</td>
                                    <td className="px-3 py-2 text-right tabular-nums text-green-900">
                                        {dataDasar.baseline_sampah.toLocaleString('id-ID')} kg/{dataDasar.baseline_sampah_periode}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-3 py-2 text-green-800">Jenis Sampah Dominan</td>
                                    <td className="px-3 py-2 text-right text-xs text-green-900">
                                        <div className="space-y-0.5">
                                            {dataDasar.jenis_sampah_dominan?.map((item) => (
                                                <div key={item.kategori}>
                                                    {item.kategori}: {Number(item.berat || 0).toLocaleString('id-ID')} kg/{item.periode}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-3 py-2 text-green-800">Kondisi Fasilitas</td>
                                    <td className="px-3 py-2 text-xs text-gray-500">
                                        {dataDasar.kondisi_fasilitas || <span className="text-slate-400 italic">Belum diisi</span>}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function Dashboard() {
    const { auth, dataDasar, rincianArea, penimbanganByArea, pilahByJenis, distribusiByTujuan, petugasStats, statusBerat, siapDidistribusikanByJenis, progress, progressPetugasNip, progressDate, petugasList, filters } = usePage<PageProps & { auth: Auth }>().props;
    const isAdmin = auth.user.role === 'admin';
    const dashboardUrl = isAdmin ? '/admin/dashboard' : '/petugas/dashboard';

    const siapSortedData = siapDidistribusikanByJenis.slice().sort((a, b) => b.value - a.value);
    const siapTotal = siapDidistribusikanByJenis.reduce((s, d) => s + d.value, 0);

    const [activePreset, setActivePreset] = useState<PresetKey>(
        getPresetKey(filters.start_date, filters.end_date)
    );
    const [startDate, setStartDate] = useState(filters.start_date ?? '');
    const [endDate, setEndDate] = useState(filters.end_date ?? '');

    const [progressPetugas, setProgressPetugas] = useState(progressPetugasNip ?? 'all');
    const [progressDateState, setProgressDateState] = useState(progressDate);

    function applyFilter(params: { start_date?: string | null; end_date?: string | null; progress_petugas?: string | null; progress_date?: string | null }) {
        const query: Record<string, string> = {};

        if (params.start_date) {
query.start_date = params.start_date;
}

        if (params.end_date) {
query.end_date = params.end_date;
}

        if (params.progress_petugas) {
query.progress_petugas = params.progress_petugas;
}

        if (params.progress_date) {
query.progress_date = params.progress_date;
}

        router.get(dashboardUrl, query, { preserveState: true, preserveScroll: true, replace: true });
    }

    function progressParams() {
        const p: Record<string, string> = {};

        if (progressPetugas !== 'all') {
p.progress_petugas = progressPetugas;
}

        if (progressDateState) {
p.progress_date = progressDateState;
}

        return p;
    }

    function handleProgressPetugasChange(value: string) {
        setProgressPetugas(value);
        const q: Record<string, string> = {};

        if (startDate) {
q.start_date = startDate;
}

        if (endDate) {
q.end_date = endDate;
}

        if (value !== 'all') {
q.progress_petugas = value;
}

        if (progressDateState) {
q.progress_date = progressDateState;
}

        router.get(dashboardUrl, q, { preserveState: true, preserveScroll: true, replace: true });
    }

    function handleProgressDateChange(value: string) {
        setProgressDateState(value);
        const q: Record<string, string> = {};

        if (startDate) {
q.start_date = startDate;
}

        if (endDate) {
q.end_date = endDate;
}

        if (progressPetugas !== 'all') {
q.progress_petugas = progressPetugas;
}

        if (value) {
q.progress_date = value;
}

        router.get(dashboardUrl, q, { preserveState: true, preserveScroll: true, replace: true });
    }

    function handlePreset(preset: typeof PRESETS[number]) {
        setActivePreset(preset.key);

        if (preset.days === null) {
            setStartDate('');
            setEndDate('');
            applyFilter({ ...progressParams() });
        } else if (preset.days === 0) {
            const today = formatDateInput(new Date());
            setStartDate(today);
            setEndDate(today);
            applyFilter({ start_date: today, end_date: today, ...progressParams() });
        } else {
            const s = daysAgo(preset.days);
            const e = formatDateInput(new Date());
            setStartDate(s);
            setEndDate(e);
            applyFilter({ start_date: s, end_date: e, ...progressParams() });
        }
    }

    function handleCustomDate() {
        setActivePreset('all');
        applyFilter({
            start_date: startDate || null,
            end_date: endDate || null,
            ...progressParams(),
        });
    }

    return (
        <>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DataDasarSummary dataDasar={dataDasar} rincianArea={rincianArea} />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight">
                            Dashboard
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Grafik pembagian berat sampah
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex flex-wrap items-center rounded-lg border border-green-200 bg-white p-0.5">
                            {PRESETS.map((preset) => (
                                <button
                                    key={preset.key}
                                    onClick={() => handlePreset(preset)}
                                    className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 ${
                                        activePreset === preset.key
                                            ? 'bg-green-600 text-white shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-green-200 bg-white px-2 py-1">
                            <CalendarIcon className="size-3.5 text-gray-400 shrink-0" />
                            <SimpleDatePicker value={startDate} onChange={setStartDate} placeholder="tt/bb/tttt" />
                            <span className="hidden text-xs text-gray-400 sm:inline">&ndash;</span>
                            <SimpleDatePicker value={endDate} onChange={setEndDate} placeholder="tt/bb/tttt" />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCustomDate}
                                className="h-6 px-2 text-xs text-green-700 hover:bg-green-50 hover:text-green-800"
                            >
                                Terapkan
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card className="border-green-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base text-green-900">
                                <Package className="size-5 text-green-600" />
                                Status Berat Sampah
                            </CardTitle>
                            <p className="text-xs text-green-700">
                                Alur berat sampah dari penimbangan hingga distribusi
                            </p>
                        </CardHeader>
                        <CardContent>
                            {(() => {
                                const STATUS_COLORS = ['#ef4444', '#f59e0b', '#22c55e'];
                                const STATUS_ICONS = [Clock, Package, CheckCircle];
                                const chartData = [
                                    { key: 'menunggu_pemilahan', name: 'Menunggu Pemilahan', value: statusBerat.menunggu_pemilahan },
                                    { key: 'siap_didistribusikan', name: 'Sisa & Siap Didistribusikan', value: statusBerat.siap_didistribusikan },
                                    { key: 'sudah_didistribusikan', name: 'Sudah Didistribusikan', value: statusBerat.sudah_didistribusikan },
                                ];
                                const total = chartData.reduce((s, d) => s + d.value, 0);

                                return (
                                    <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center">
                                        <div className="relative h-[240px] w-[240px] shrink-0">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={chartData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={65}
                                                        outerRadius={105}
                                                        paddingAngle={3}
                                                        dataKey="value"
                                                        stroke="none"
                                                    >
                                                        {chartData.map((_, index) => (
                                                            <Cell key={`cell-${index}`} fill={STATUS_COLORS[index]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip content={<CustomTooltip />} />
                                                    <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-900 text-2xl font-bold tabular-nums">
                                                        {total.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </text>
                                                    <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-500 text-xs">
                                                        kg total
                                                    </text>
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>

                                        <div className="flex w-full flex-col gap-3">
                                            {chartData.map((item, index) => {
                                                const pct = total > 0 ? (item.value / total) * 100 : 0;
                                                const Icon = STATUS_ICONS[index];

                                                return (
                                                    <div key={item.key} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${STATUS_COLORS[index]}15` }}>
                                                            <Icon className="size-4" style={{ color: STATUS_COLORS[index] }} />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-xs font-medium text-gray-700">{item.name}</p>
                                                            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                                                                <div
                                                                    className="h-full rounded-full transition-all"
                                                                    style={{ width: `${pct}%`, backgroundColor: STATUS_COLORS[index] }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="shrink-0 text-right">
                                                            <p className="text-sm font-bold tabular-nums text-gray-900">
                                                                {item.value.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                            </p>
                                                            <p className="text-[10px] text-gray-500">kg &middot; {pct.toFixed(1)}%</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })()}
                        </CardContent>
                    </Card>

                     <PieChartCard
                         title="Penimbangan per Area"
                         icon={Scale}
                         data={penimbanganByArea}
                         totalLabel="Total berat ditimbang"
                     />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <PieChartCard
                        title="Pilah Sampah per Jenis"
                        icon={Recycle}
                        data={pilahByJenis}
                        totalLabel="Total berat dipilah"
                    />
                    <PieChartCard
                        title="Distribusi per Tujuan"
                        icon={Truck}
                        data={distribusiByTujuan}
                        totalLabel="Total berat didistribusikan"
                    />
                    <Card className="border-green-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base text-green-900">
                                <Send className="size-5 text-green-600" />
                                Sisa dan Siap Didistribusikan
                            </CardTitle>
                            <p className="text-xs text-green-700">
                                Total sampah sisa dan siap didistribusikan : {siapTotal.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg
                            </p>
                        </CardHeader>
                        <CardContent>
                            {siapDidistribusikanByJenis.length > 0 ? (
                                <>
                                    <div className="h-75">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <defs>
                                                    <filter id="pieLabelShadow" x="-50%" y="-50%" width="200%" height="200%">
                                                        <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#000000" floodOpacity="0.65" />
                                                    </filter>
                                                </defs>
                                                <Pie
                                                    data={siapSortedData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={renderCustomLabel}
                                                    outerRadius={110}
                                                    dataKey="value"
                                                    stroke="none"
                                                >
                                                    {siapSortedData.map((entry) => (
                                                        <Cell key={`cell-${entry.name}`} fill={getCategoryColor(entry.name)} />
                                                    ))}
                                                </Pie>
                                                <Tooltip content={<CustomTooltip />} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mt-2 space-y-2">
                                            {siapSortedData
                                            .map((item) => {
                                                const percent = siapTotal > 0 ? (item.value / siapTotal) * 100 : 0;

                                                return (
                                                    <div key={item.name}>
                                                        <div className="flex items-start gap-2">
                                                            <span
                                                                className="mt-1 size-2.5 shrink-0 rounded-full"
                                                                style={{ backgroundColor: getCategoryColor(item.name) }}
                                                            />
                                                            <span className="min-w-0 text-xs text-gray-700 leading-snug break-words">
                                                                {item.name}
                                                            </span>
                                                        </div>
                                                        <div className="ml-4.5 flex items-baseline gap-1.5">
                                                            <span className="text-xs font-medium tabular-nums text-gray-900">
                                                                {item.value.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg
                                                            </span>
                                                            <span className="text-xs tabular-nums text-gray-500">
                                                                ({percent.toFixed(1)}%)
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </>
                            ) : (
                                <div className="flex h-[220px] items-center justify-center text-sm text-gray-400">
                                    Semua sudah terdistribusi
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-green-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base text-green-900">
                            <CheckCircle className="size-5 text-green-600" />
                            Progres Checklist
                        </CardTitle>
                        <p className="text-xs text-green-700">
                            Progres checklist harian, mingguan, dan bulanan
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex flex-wrap items-end gap-3">
                            {isAdmin && (
                                <div className="grid gap-1">
                                    <label htmlFor="progress-petugas" className="text-xs font-medium text-green-700">Petugas</label>
                                    <select
                                        id="progress-petugas"
                                        value={progressPetugasNip ?? 'all'}
                                        onChange={(e) => handleProgressPetugasChange(e.target.value)}
                                        className="h-9 rounded-md border border-green-200 bg-white px-3 text-sm shadow-sm focus-visible:border-green-500 focus-visible:ring-1 focus-visible:ring-green-500/20"
                                    >
                                        <option value="all">Semua Petugas</option>
                                        {petugasList.map((p) => (
                                        <option key={p.nip} value={p.nip}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            )}
                            <div className="grid gap-1">
                                <label className="text-xs font-medium text-green-700">Tanggal</label>
                                <NativeDatePicker
                                    value={progressDate}
                                    onChange={handleProgressDateChange}
                                />
                            </div>
                        </div>
                        <ChecklistProgress progress={progress} />
                    </CardContent>
                </Card>

                <Card className="border-green-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base text-green-900">
                            <Users className="size-5 text-green-600" />
                            Rincian Aktivitas Petugas
                        </CardTitle>
                        <p className="text-xs text-green-700">
                            Rekap penimbangan, pilah sampah, dan distribusi per petugas
                        </p>
                    </CardHeader>
                    <CardContent>
                        {petugasStats.length > 0 ? (
                            <div className="space-y-5">
                                <div className="flex items-center gap-4 text-xs text-gray-600">
                                    <span className="flex items-center gap-1.5">
                                        <span className="size-2.5 rounded-full" style={{ backgroundColor: BAR_COLORS.penimbangan }} />
                                        Penimbangan
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="size-2.5 rounded-full" style={{ backgroundColor: BAR_COLORS.pilah_sampah }} />
                                        Pilah Sampah
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="size-2.5 rounded-full" style={{ backgroundColor: BAR_COLORS.distribusi }} />
                                        Distribusi
                                    </span>
                                </div>

                                {(() => {
                                    const maxBerat = Math.max(...petugasStats.map((p) => p.penimbangan.total_berat + p.pilah_sampah.total_berat + p.distribusi.total_berat));

                                    return petugasStats.slice().sort((a, b) => {
                                        const totalA = a.penimbangan.total_berat + a.pilah_sampah.total_berat + a.distribusi.total_berat;
                                        const totalB = b.penimbangan.total_berat + b.pilah_sampah.total_berat + b.distribusi.total_berat;

                                        return totalB - totalA;
                                    }).map((p) => {
                                        const totalBerat = p.penimbangan.total_berat + p.pilah_sampah.total_berat + p.distribusi.total_berat;
                                        const widthPct = maxBerat > 0 ? (totalBerat / maxBerat) * 100 : 0;
                                        const segments: { key: ActivityKey; label: string; berat: number; jumlah: number }[] = [
                                            { key: 'penimbangan', label: 'Penimbangan', berat: p.penimbangan.total_berat, jumlah: p.penimbangan.jumlah },
                                            { key: 'pilah_sampah', label: 'Pilah Sampah', berat: p.pilah_sampah.total_berat, jumlah: p.pilah_sampah.jumlah },
                                            { key: 'distribusi', label: 'Distribusi', berat: p.distribusi.total_berat, jumlah: p.distribusi.jumlah },
                                        ];

                                        return (
                                            <div key={p.name}>
                                                <div className="mb-1.5 flex items-center justify-between">
                                                    <span className="text-sm font-medium text-green-900">{p.name}</span>
                                                    <span className="text-xs tabular-nums text-gray-500">
                                                        {totalBerat.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg total
                                                    </span>
                                                </div>
                                                <div className="relative">
                                                    <div
                                                        className="flex h-7 rounded-lg bg-gray-100"
                                                        style={{ width: `${Math.max(widthPct, 3)}%` }}
                                                    >
                                                        {segments.map((seg, idx) => {
                                                            const pct = totalBerat > 0 ? (seg.berat / totalBerat) * 100 : 0;

                                                            if (pct === 0) {
return null;
}

                                                            const isFirst = idx === 0 || !segments.slice(0, idx).some((s) => s.berat > 0);
                                                            const isLast = idx === segments.length - 1 || !segments.slice(idx + 1).some((s) => s.berat > 0);

                                                            return (
                                                                <div
                                                                    key={seg.key}
                                                                    className="group relative flex h-7 items-center justify-center transition-all"
                                                                    style={{
                                                                        width: `${pct}%`,
                                                                        backgroundColor: BAR_COLORS[seg.key],
                                                                        borderRadius: isFirst && isLast ? '8px' : isFirst ? '8px 0 0 8px' : isLast ? '0 8px 8px 0' : undefined,
                                                                    }}
                                                                >
                                                                    {pct > 8 && (
                                                                        <span className="text-[10px] font-medium text-white tabular-nums">
                                                                            {pct.toFixed(0)}%
                                                                        </span>
                                                                    )}
                                                                    <div className="pointer-events-none absolute -top-14 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-md border bg-white px-2.5 py-1.5 shadow-md group-hover:block">
                                                                        <p className="text-xs font-medium text-gray-900">{seg.label}</p>
                                                                        <p className="text-xs text-gray-600">
                                                                            {seg.jumlah} catatan &middot; {seg.berat.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        ) : (
                            <p className="py-8 text-center text-sm text-gray-400">
                                Belum ada data petugas.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}