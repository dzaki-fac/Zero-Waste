import { Head, router, usePage } from '@inertiajs/react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Options = {
    area: string[];
    sub_area: Record<string, string[]>;
    jenis_sampah: string[];
    tujuan_distribusi: string[];
};

const tabs = ['Area', 'Jenis Sampah', 'Tujuan Distribusi'] as const;
type Tab = (typeof tabs)[number];

export default function Settings() {
    const { options: initial, success } = usePage().props as unknown as {
        options: Options;
        success?: string;
    };

    const [options, setOptions] = useState<Options>(structuredClone(initial));
    const [activeTab, setActiveTab] = useState<Tab>('Area');
    const [saving, setSaving] = useState(false);

    const updateList = (key: 'area' | 'jenis_sampah' | 'tujuan_distribusi', i: number, value: string) => {
        const list = [...options[key]];
        list[i] = value;
        setOptions({ ...options, [key]: list });
    };

    const addListItem = (key: 'area' | 'jenis_sampah' | 'tujuan_distribusi') => {
        setOptions({ ...options, [key]: [...options[key], ''] });
    };

    const removeListItem = (key: 'area' | 'jenis_sampah' | 'tujuan_distribusi', i: number) => {
        if (options[key].length <= 1) return;
        setOptions({ ...options, [key]: options[key].filter((_, idx) => idx !== i) });
    };

    const updateSubArea = (areaKey: string, i: number, value: string) => {
        const sub = { ...options.sub_area };
        const list = [...(sub[areaKey] || [])];
        list[i] = value;
        sub[areaKey] = list;
        setOptions({ ...options, sub_area: sub });
    };

    const addSubArea = (areaKey: string) => {
        const sub = { ...options.sub_area };
        sub[areaKey] = [...(sub[areaKey] || []), ''];
        setOptions({ ...options, sub_area: sub });
    };

    const removeSubArea = (areaKey: string, i: number) => {
        const sub = { ...options.sub_area };
        sub[areaKey] = sub[areaKey].filter((_, idx) => idx !== i);
        setOptions({ ...options, sub_area: sub });
    };

    const handleSave = () => {
        setSaving(true);
        router.post('/admin/settings', options, {
            preserveScroll: true,
            onFinish: () => setSaving(false),
        });
    };

    const tabContent = {
        Area: (
            <div className="space-y-8">
                <div>
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-800">Daftar Area</h3>
                        <Button type="button" variant="outline" size="sm" onClick={() => addListItem('area')}>
                            <Plus className="mr-1 h-3.5 w-3.5" /> Tambah
                        </Button>
                    </div>
                    <div className="divide-y divide-gray-100 rounded-lg border">
                        {options.area.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 bg-white p-3 even:bg-gray-50">
                                <Input value={item} onChange={(e) => updateList('area', i, e.target.value)} className="h-9 flex-1 text-sm" />
                                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-red-500" onClick={() => removeListItem('area', i)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="mb-3 text-sm font-semibold text-gray-800">Sub Area</h3>
                    {options.area.length === 0 && (
                        <p className="text-sm text-gray-500">Belum ada area. Tambah area terlebih dahulu.</p>
                    )}
                    {options.area.map((areaKey) => (
                        <div key={areaKey} className="mb-4 rounded-lg border p-4">
                            <div className="mb-2 flex items-center justify-between">
                                <h4 className="text-sm font-medium text-gray-700">{areaKey}</h4>
                                <Button type="button" variant="outline" size="sm" onClick={() => addSubArea(areaKey)}>
                                    <Plus className="mr-1 h-3.5 w-3.5" /> Tambah
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {(options.sub_area[areaKey] || []).map((sub, j) => (
                                    <div key={j} className="flex items-center gap-2">
                                        <Input
                                            value={sub}
                                            onChange={(e) => updateSubArea(areaKey, j, e.target.value)}
                                            placeholder="Nama sub area"
                                            className="h-9 flex-1 text-sm"
                                        />
                                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-red-500" onClick={() => removeSubArea(areaKey, j)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ),
        'Jenis Sampah': (
            <div>
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800">Daftar Jenis Sampah</h3>
                    <Button type="button" variant="outline" size="sm" onClick={() => addListItem('jenis_sampah')}>
                        <Plus className="mr-1 h-3.5 w-3.5" /> Tambah
                    </Button>
                </div>
                <div className="divide-y divide-gray-100 rounded-lg border">
                    {options.jenis_sampah.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 bg-white p-3 even:bg-gray-50">
                            <Input
                                value={item}
                                onChange={(e) => updateList('jenis_sampah', i, e.target.value)}
                                className="h-9 flex-1 text-sm"
                            />
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-red-500" onClick={() => removeListItem('jenis_sampah', i)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        ),
        'Tujuan Distribusi': (
            <div>
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800">Daftar Tujuan Distribusi</h3>
                    <Button type="button" variant="outline" size="sm" onClick={() => addListItem('tujuan_distribusi')}>
                        <Plus className="mr-1 h-3.5 w-3.5" /> Tambah
                    </Button>
                </div>
                <div className="divide-y divide-gray-100 rounded-lg border">
                    {options.tujuan_distribusi.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 bg-white p-3 even:bg-gray-50">
                            <Input
                                value={item}
                                onChange={(e) => updateList('tujuan_distribusi', i, e.target.value)}
                                className="h-9 flex-1 text-sm"
                            />
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-red-500" onClick={() => removeListItem('tujuan_distribusi', i)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        ),
    };

    return (
        <>
            <Head title="Pengaturan Data" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading title="Pengaturan Data" description="Kelola area, jenis sampah, dan tujuan distribusi" />

                {success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {success}
                    </div>
                )}

                <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                                activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="rounded-xl border bg-white p-5 shadow-sm">
                    {tabContent[activeTab]}
                </div>

                <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={saving}>
                        <Save className="mr-2 h-4 w-4" />
                        {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
                    </Button>
                </div>
            </div>
        </>
    );
}

const lantaiValues = ['Lantai 1', 'Lantai 2', 'Lantai 3', 'Lantai 4'];
