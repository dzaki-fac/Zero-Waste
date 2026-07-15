import { Head, usePage } from '@inertiajs/react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale, Recycle, Truck } from 'lucide-react';

type ChartData = {
    name: string;
    value: number;
}[];

type PageProps = {
    penimbanganByArea: ChartData;
    pilahByJenis: ChartData;
    distribusiByTujuan: ChartData;
};

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
    const { penimbanganByArea, pilahByJenis, distribusiByTujuan } = usePage<PageProps>().props;

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
            </div>
        </>
    );
}
