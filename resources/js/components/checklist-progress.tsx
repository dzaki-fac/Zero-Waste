import { CheckCircle2, Clock } from 'lucide-react';

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

const barColors = {
    harian: 'bg-green-500',
    mingguan: 'bg-amber-500',
    bulanan: 'bg-blue-500',
};

const bgColors = {
    harian: 'bg-green-100',
    mingguan: 'bg-amber-100',
    bulanan: 'bg-blue-100',
};

const labels = {
    harian: 'Harian',
    mingguan: 'Mingguan',
    bulanan: 'Bulanan',
};

export default function ChecklistProgress({ progress }: { progress: ProgressData }) {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {(Object.keys(labels) as (keyof typeof labels)[]).map((key) => {
                const item = progress[key];
                const pct = item.persentase;

                return (
                    <div
                        key={key}
                        className="rounded-lg border border-green-100 bg-white p-4 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className={`size-2 rounded-full ${barColors[key]}`} />
                                <span className="text-xs font-semibold text-gray-700">{labels[key]}</span>
                            </div>
                            <span className="text-xs font-medium text-gray-500">{item.periode}</span>
                        </div>

                        <div className="flex items-end justify-between mb-1.5">
                            <span className="text-lg font-bold text-gray-900">{pct}%</span>
                            <span className="text-xs text-gray-500">
                                {item.selesai} / {item.total}
                            </span>
                        </div>

                        <div className={`h-2 w-full overflow-hidden rounded-full ${bgColors[key]}`}>
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${barColors[key]}`}
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
