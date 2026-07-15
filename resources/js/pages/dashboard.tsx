import { Head, router, usePage } from '@inertiajs/react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scale, Recycle, Truck, Users, CalendarIcon, Clock, Package, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

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

type PageProps = {
    penimbanganByArea: ChartData;
    pilahByJenis: ChartData;
    distribusiByTujuan: ChartData;
    petugasStats: PetugasStat[];
    statusBerat: {
        belum_dipilah: number;
        belum_didistribusikan: number;
        sudah_didistribusikan: number;
    };
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
    if (typeof percent !== 'number' || percent < 0.05) return null;
    if (typeof cx !== 'number' || typeof cy !== 'number' || typeof midAngle !== 'number' || typeof innerRadius !== 'number' || typeof outerRadius !== 'number') return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-medium">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
}

function PieChartCard({ title, icon: Icon, data, totalLabel }: {
    title: string; icon: React.ComponentType<{ className?: string }>; data: ChartData; totalLabel: string;
}) {
    const total = data.reduce((sum, d) => sum + d.value, 0);

    return (
        <Card className="border-green-200">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base text-green-900">
                    <Icon className="size-5 text-green-600" />
                    {title}
                </CardTitle>
                <p className="text-xs text-green-600/70">
                    {totalLabel}: {total.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg
                </p>
            </CardHeader>
            <CardContent>
                {data.length > 0 ? (
                    <div className="h-75">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomLabel}
                                    outerRadius={110}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {data.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="flex h-75 items-center justify-center text-sm text-gray-400">
                        Belum ada data
                    </div>
                )}

                {data.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                        {data
                            .slice()
                            .sort((a, b) => b.value - a.value)
                            .map((item, index) => {
                                const percent = total > 0 ? (item.value / total) * 100 : 0;
                                return (
                                    <div key={item.name} className="flex items-center gap-2">
                                        <span
                                            className="size-2.5 shrink-0 rounded-full"
                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                        />
                                        <span className="min-w-0 flex-1 truncate text-xs text-gray-700">
                                            {item.name}
                                        </span>
                                        <span className="shrink-0 text-xs font-medium tabular-nums text-gray-900">
                                            {item.value.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg
                                        </span>
                                        <span className="shrink-0 text-xs tabular-nums text-gray-500">
                                            ({percent.toFixed(1)}%)
                                        </span>
                                    </div>
                                );
                            })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

type PresetKey = 'all' | '7d' | '30d' | '3m';

const PRESETS: { key: PresetKey; label: string; days: number | null }[] = [
    { key: 'all', label: 'Semua', days: null },
    { key: '7d', label: '7 Hari', days: 7 },
    { key: '30d', label: '30 Hari', days: 30 },
    { key: '3m', label: '3 Bulan', days: 90 },
];

function getPresetKey(start: string | null, end: string | null): PresetKey {
    if (!start && !end) return 'all';
    if (start && end) {
        const diff = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000);
        if (diff === 6) return '7d';
        if (diff === 29) return '30d';
        if (diff === 89) return '3m';
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
        if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
        else setViewMonth(viewMonth - 1);
    }

    function nextMonth() {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
        else setViewMonth(viewMonth + 1);
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
            if (!isNaN(d.getTime())) return formatDateInput(d);
        }
        const iso = cleaned.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
        if (iso) {
            const d = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
            if (!isNaN(d.getTime())) return formatDateInput(d);
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
                onFocus={() => { setOpen(true); setTyping(true); setInputValue(value ? formatDisplayDate(value) : ''); }}
                onChange={(e) => { setInputValue(e.target.value); setTyping(true); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commitTypedValue(); setOpen(false); } if (e.key === 'Escape') { setInputValue(value ? formatDisplayDate(value) : ''); setTyping(false); setOpen(false); } }}
                onBlur={() => { if (typing) commitTypedValue(); }}
                className="w-32.5 border-0 bg-transparent text-xs text-gray-700 outline-none hover:text-gray-900 cursor-text placeholder:text-gray-400"
            />
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onMouseDown={(e) => { if (e.target === e.currentTarget) { commitTypedValue(); setOpen(false); } }}>
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
                            <button type="button" onClick={() => { commitTypedValue(); setOpen(false); }} className="rounded-lg bg-gray-100 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200">
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Dashboard() {
    const { penimbanganByArea, pilahByJenis, distribusiByTujuan, petugasStats, statusBerat, filters } = usePage<PageProps>().props;

    const [activePreset, setActivePreset] = useState<PresetKey>(
        getPresetKey(filters.start_date, filters.end_date)
    );
    const [startDate, setStartDate] = useState(filters.start_date ?? '');
    const [endDate, setEndDate] = useState(filters.end_date ?? '');

    function applyFilter(params: { start_date?: string | null; end_date?: string | null }) {
        const query: Record<string, string> = {};
        if (params.start_date) query.start_date = params.start_date;
        if (params.end_date) query.end_date = params.end_date;
        router.get('/admin/dashboard', query, { preserveState: true, replace: true });
    }

    function handlePreset(preset: typeof PRESETS[number]) {
        setActivePreset(preset.key);
        if (preset.days === null) {
            setStartDate('');
            setEndDate('');
            applyFilter({});
        } else {
            const s = daysAgo(preset.days);
            const e = formatDateInput(new Date());
            setStartDate(s);
            setEndDate(e);
            applyFilter({ start_date: s, end_date: e });
        }
    }

    function handleCustomDate() {
        setActivePreset('all');
        applyFilter({
            start_date: startDate || null,
            end_date: endDate || null,
        });
    }

    return (
        <>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
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
                        <div className="flex items-center rounded-lg border border-green-200 bg-white p-0.5">
                            {PRESETS.map((preset) => (
                                <button
                                    key={preset.key}
                                    onClick={() => handlePreset(preset)}
                                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                                        activePreset === preset.key
                                            ? 'bg-green-600 text-white shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-1.5 rounded-lg border border-green-200 bg-white px-2 py-1">
                            <CalendarIcon className="size-3.5 text-gray-400" />
                            <SimpleDatePicker value={startDate} onChange={setStartDate} placeholder="tt/bb/tttt" />
                            <span className="text-xs text-gray-400">&ndash;</span>
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

                <Card className="border-green-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base text-green-900">
                            <Package className="size-5 text-green-600" />
                            Status Berat Sampah
                        </CardTitle>
                        <p className="text-xs text-green-600/70">
                            Alur berat sampah dari penimbangan hingga distribusi
                        </p>
                    </CardHeader>
                    <CardContent>
                        {(() => {
                            const STATUS_COLORS = ['#ef4444', '#f59e0b', '#22c55e'];
                            const STATUS_ICONS = [Clock, Package, CheckCircle];
                            const chartData = [
                                { key: 'belum_dipilah', name: 'Tahap Pemilahan', value: statusBerat.belum_dipilah },
                                { key: 'belum_didistribusikan', name: 'Tahap Distribusi', value: statusBerat.belum_didistribusikan },
                                { key: 'sudah_didistribusikan', name: 'Selesai', value: statusBerat.sudah_didistribusikan },
                            ];
                            const total = chartData.reduce((s, d) => s + d.value, 0);

                            return (
                                <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
                                    <div className="relative h-60 w-60 shrink-0">
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
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <p className="text-2xl font-bold tabular-nums text-gray-900">
                                                {total.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </p>
                                            <p className="text-xs text-gray-500">kg total</p>
                                        </div>
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

                <div className="grid gap-4 lg:grid-cols-3">
                    <PieChartCard
                        title="Penimbangan per Area"
                        icon={Scale}
                        data={penimbanganByArea}
                        totalLabel="Total berat ditimbang"
                    />
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
                </div>

                <Card className="border-green-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base text-green-900">
                            <Users className="size-5 text-green-600" />
                            Rincian Aktivitas Petugas
                        </CardTitle>
                        <p className="text-xs text-green-600/70">
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
                                    const logMax = Math.log10(1 + maxBerat);

                                    return petugasStats.slice().sort((a, b) => {
                                        const totalA = a.penimbangan.total_berat + a.pilah_sampah.total_berat + a.distribusi.total_berat;
                                        const totalB = b.penimbangan.total_berat + b.pilah_sampah.total_berat + b.distribusi.total_berat;
                                        return totalB - totalA;
                                    }).map((p) => {
                                        const totalBerat = p.penimbangan.total_berat + p.pilah_sampah.total_berat + p.distribusi.total_berat;
                                        const logWidth = logMax > 0 ? (Math.log10(1 + totalBerat) / logMax) * 100 : 0;
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
                                                        style={{ width: `${Math.max(logWidth, 3)}%` }}
                                                    >
                                                        {segments.map((seg, idx) => {
                                                            const pct = totalBerat > 0 ? (seg.berat / totalBerat) * 100 : 0;
                                                            if (pct === 0) return null;
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
