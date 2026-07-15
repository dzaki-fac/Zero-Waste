import { Head, usePage } from '@inertiajs/react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale, Recycle, Truck, Users } from 'lucide-react';

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
                    <div className="h-[300px]">
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
                    <div className="flex h-[300px] items-center justify-center text-sm text-gray-400">
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

export default function Dashboard() {
    const { penimbanganByArea, pilahByJenis, distribusiByTujuan, petugasStats } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight">
                        Dashboard
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Grafik pembagian berat sampah
                    </p>
                </div>

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
