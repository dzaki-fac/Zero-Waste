import { Head, router, usePage } from '@inertiajs/react';
import { Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
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
    const { options, success } = usePage().props as unknown as {
        options: Options;
        success?: string;
    };

    const [activeTab, setActiveTab] = useState<Tab>('Area');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [subDialogOpen, setSubDialogOpen] = useState(false);
    const [jenisDialogOpen, setJenisDialogOpen] = useState(false);
    const [tujuanDialogOpen, setTujuanDialogOpen] = useState(false);
    const [subDialogArea, setSubDialogArea] = useState('');
    const [newArea, setNewArea] = useState('');
    const [newSub, setNewSub] = useState('');
    const [newJenis, setNewJenis] = useState('');
    const [newTujuan, setNewTujuan] = useState('');
    const [confirm, setConfirm] = useState<{ open: boolean; title: string; message: string; onConfirm: () => void }>({
        open: false, title: '', message: '', onConfirm: () => {},
    });

    const save = (next: Options) => {
        router.post('/admin/settings', next, { preserveScroll: true });
    };

    const addArea = () => {
        const name = newArea.trim();
        if (!name || options.area.includes(name)) return;
        save({ ...options, area: [...options.area, name] });
        setNewArea('');
    };

    const removeArea = (i: number) => {
        if (options.area.length <= 1) return;
        const area = options.area[i];
        setConfirm({
            open: true,
            title: 'Hapus Area',
            message: `Yakin ingin menghapus area "${area}"?`,
            onConfirm: () => {
                const sub = { ...options.sub_area };
                delete sub[area];
                save({
                    ...options,
                    area: options.area.filter((_, idx) => idx !== i),
                    sub_area: sub,
                });
            },
        });
    };

    const addSubArea = (areaKey: string) => {
        const name = newSub.trim();
        if (!name) return;
        const sub = { ...options.sub_area };
        sub[areaKey] = [...(sub[areaKey] || []), name];
        save({ ...options, sub_area: sub });
        setNewSub('');
    };

    const removeSubArea = (areaKey: string, i: number) => {
        const name = (options.sub_area[areaKey] || [])[i];
        setConfirm({
            open: true,
            title: 'Hapus Sub Area',
            message: `Yakin ingin menghapus sub area "${name}" dari ${areaKey}?`,
            onConfirm: () => {
                const sub = { ...options.sub_area };
                sub[areaKey] = sub[areaKey].filter((_, idx) => idx !== i);
                save({ ...options, sub_area: sub });
            },
        });
    };

    const addListItem = (key: 'jenis_sampah' | 'tujuan_distribusi', value: string) => {
        const name = value.trim();
        if (!name || options[key].includes(name)) return;
        save({ ...options, [key]: [...options[key], name] });
    };

    const removeListItem = (key: 'jenis_sampah' | 'tujuan_distribusi', i: number) => {
        if (options[key].length <= 1) return;
        const name = options[key][i];
        const label = key === 'jenis_sampah' ? 'jenis sampah' : 'tujuan';
        setConfirm({
            open: true,
            title: 'Hapus Data',
            message: `Yakin ingin menghapus ${label} "${name}"?`,
            onConfirm: () => {
                save({ ...options, [key]: options[key].filter((_, idx) => idx !== i) });
            },
        });
    };

    const tabContent = {
        Area: (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800">Daftar Area</h3>
                    <Button type="button" onClick={() => setDialogOpen(true)} className="bg-green-600 text-white hover:bg-green-700">
                        <Plus className="mr-1 h-4 w-4" /> Tambah Area
                    </Button>
                </div>

                {options.area.length === 0 && (
                    <p className="text-sm text-gray-500">Belum ada area.</p>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                    {options.area.map((areaKey, i) => (
                        <div key={areaKey} className="rounded-xl border bg-white p-4 shadow-sm">
                            <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-2">
                                <h4 className="text-sm font-semibold text-gray-800">{areaKey}</h4>
                                <div className="flex items-center gap-1">
                                    <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={() => { setSubDialogArea(areaKey); setNewSub(''); setSubDialogOpen(true); }}>
                                        <Plus className="mr-1 h-3 w-3" /> Sub Area
                                    </Button>
                                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:bg-red-50" onClick={() => removeArea(i)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                                {(options.sub_area[areaKey] || []).length === 0 && (
                                    <span className="text-xs text-gray-400">Belum ada sub area</span>
                                )}
                                {(options.sub_area[areaKey] || []).map((sub, j) => (
                                    <span key={j} className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                        {sub}
                                        <button type="button" onClick={() => removeSubArea(areaKey, j)} className="ml-0.5 rounded-full p-0.5 hover:bg-green-200">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ),
        'Jenis Sampah': (
            <div>
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800">Daftar Jenis Sampah</h3>
                    <Button type="button" onClick={() => { setNewJenis(''); setJenisDialogOpen(true); }} className="bg-green-600 text-white hover:bg-green-700">
                        <Plus className="mr-1 h-4 w-4" /> Tambah Jenis
                    </Button>
                </div>

                {options.jenis_sampah.length === 0 && (
                    <p className="mt-4 text-sm text-gray-500">Belum ada jenis sampah.</p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                    {options.jenis_sampah.map((item, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                            {item}
                            <button type="button" onClick={() => removeListItem('jenis_sampah', i)} className="ml-0.5 rounded-full p-0.5 hover:bg-green-200">
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </span>
                    ))}
                </div>
            </div>
        ),
        'Tujuan Distribusi': (
            <div>
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800">Daftar Tujuan Distribusi</h3>
                    <Button type="button" onClick={() => { setNewTujuan(''); setTujuanDialogOpen(true); }} className="bg-green-600 text-white hover:bg-green-700">
                        <Plus className="mr-1 h-4 w-4" /> Tambah Tujuan
                    </Button>
                </div>

                {options.tujuan_distribusi.length === 0 && (
                    <p className="mt-4 text-sm text-gray-500">Belum ada tujuan distribusi.</p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                    {options.tujuan_distribusi.map((item, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                            {item}
                            <button type="button" onClick={() => removeListItem('tujuan_distribusi', i)} className="ml-0.5 rounded-full p-0.5 hover:bg-green-200">
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </span>
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
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 whitespace-pre-wrap">
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
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Tambah Area Baru</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-2">
                        <Label htmlFor="new-area">Nama Area</Label>
                        <Input
                            id="new-area"
                            value={newArea}
                            onChange={(e) => setNewArea(e.target.value)}
                            placeholder="Masukkan nama area"
                            className="h-12 text-base"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') { addArea(); setDialogOpen(false); }
                            }}
                            autoFocus
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button type="button" onClick={() => { addArea(); setDialogOpen(false); }} disabled={!newArea.trim()} className="bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400 disabled:text-white/70">
                            Tambah
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={subDialogOpen} onOpenChange={setSubDialogOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Tambah Sub Area</DialogTitle>
                        <p className="text-sm text-gray-500">Area: <span className="font-medium text-gray-700">{subDialogArea}</span></p>
                    </DialogHeader>
                    <div className="grid gap-2">
                        <Label htmlFor="new-sub">Nama Sub Area</Label>
                        <Input
                            id="new-sub"
                            value={newSub}
                            onChange={(e) => setNewSub(e.target.value)}
                            placeholder="Masukkan nama sub area"
                            className="h-12 text-base"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') { addSubArea(subDialogArea); setSubDialogOpen(false); }
                            }}
                            autoFocus
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setSubDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button type="button" onClick={() => { addSubArea(subDialogArea); setSubDialogOpen(false); }} disabled={!newSub.trim()} className="bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400 disabled:text-white/70">
                            Tambah
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={jenisDialogOpen} onOpenChange={setJenisDialogOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Tambah Jenis Sampah</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-2">
                        <Label htmlFor="new-jenis">Nama Jenis Sampah</Label>
                        <Input
                            id="new-jenis"
                            value={newJenis}
                            onChange={(e) => setNewJenis(e.target.value)}
                            placeholder="Masukkan nama jenis sampah"
                            className="h-12 text-base"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') { addListItem('jenis_sampah', newJenis); setJenisDialogOpen(false); }
                            }}
                            autoFocus
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setJenisDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button type="button" onClick={() => { addListItem('jenis_sampah', newJenis); setJenisDialogOpen(false); }} disabled={!newJenis.trim()} className="bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400 disabled:text-white/70">
                            Tambah
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={tujuanDialogOpen} onOpenChange={setTujuanDialogOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Tambah Tujuan Distribusi</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-2">
                        <Label htmlFor="new-tujuan">Nama Tujuan</Label>
                        <Input
                            id="new-tujuan"
                            value={newTujuan}
                            onChange={(e) => setNewTujuan(e.target.value)}
                            placeholder="Masukkan nama tujuan distribusi"
                            className="h-12 text-base"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') { addListItem('tujuan_distribusi', newTujuan); setTujuanDialogOpen(false); }
                            }}
                            autoFocus
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setTujuanDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button type="button" onClick={() => { addListItem('tujuan_distribusi', newTujuan); setTujuanDialogOpen(false); }} disabled={!newTujuan.trim()} className="bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400 disabled:text-white/70">
                            Tambah
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={confirm.open} onOpenChange={(open) => setConfirm((c) => ({ ...c, open }))}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>{confirm.title}</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-gray-600">{confirm.message}</p>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setConfirm((c) => ({ ...c, open: false }))}>
                            Batal
                        </Button>
                        <Button type="button" className="bg-red-600 text-white hover:bg-red-700" onClick={() => { confirm.onConfirm(); setConfirm((c) => ({ ...c, open: false })); }}>
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
