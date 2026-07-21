import type { ReactNode } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { PieLabelRenderProps } from 'recharts';

export type ChartData = { name: string; value: number }[];

const COLORS = [
    '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d',
    '#86efac', '#4ade80', '#a3e635', '#facc15', '#fb923c',
    '#f87171',
];

const categoryColorMap = new Map<string, string>();
export function getCategoryColor(name: string): string {
    let color = categoryColorMap.get(name);

    if (!color) {
        color = COLORS[categoryColorMap.size % COLORS.length];
        categoryColorMap.set(name, color);
    }

    return color;
}

export function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { percent?: number } }> }) {
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

export function ChartLabel(props: PieLabelRenderProps) {
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

export function PieSkeleton() {
    return (
        <div className="flex h-75 items-center justify-center text-sm text-gray-400">
            <div className="flex flex-col items-center gap-2">
                <div className="size-16 animate-pulse rounded-full bg-gray-200" />
                <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
            </div>
        </div>
    );
}

export function PieLegend({ data, total }: { data: ChartData; total: number }) {
    const sorted = data.slice().sort((a, b) => b.value - a.value);

    return (
        <div className="mt-2 space-y-2">
            {sorted.map((item) => {
                const percent = total > 0 ? (item.value / total) * 100 : 0;

                return (
                    <div key={item.name}>
                        <div className="flex items-start gap-2">
                            <span className="mt-1 size-2.5 shrink-0 rounded-full" style={{ backgroundColor: getCategoryColor(item.name) }} />
                            <span className="min-w-0 text-xs text-gray-700 leading-snug break-words">{item.name}</span>
                        </div>
                        <div className="ml-4.5 flex items-baseline gap-1.5">
                            <span className="text-xs font-medium tabular-nums text-gray-900">
                                {item.value.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg
                            </span>
                            <span className="text-xs tabular-nums text-gray-500">({percent.toFixed(1)}%)</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
