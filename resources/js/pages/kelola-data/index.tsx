import { Head, router, usePage } from '@inertiajs/react';
import { Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type RincianArea = {
    nama: string;
    deskripsi: string;
    luas: number;
};

type Options = {
    area: string[];
    jenis_sampah: string[];
    tujuan_distribusi: string[];
    rincian_area: RincianArea[];
};

type ListKey = 'jenis_sampah' | 'tujuan_distribusi';

const sections: { key: ListKey; label: string; title: string; placeholder: string }[] = [
    { key: 'jenis_sampah', label: 'Jenis Sampah', title: 'Tambah Jenis Sampah', placeholder: 'Masukkan nama jenis sampah' },
    { key: 'tujuan_distribusi', label: 'Tujuan Distribusi', title: 'Tambah Tujuan Distribusi', placeholder: 'Masukkan nama tujuan distribusi' },
];

export default function Settings() {
    const { options, success } = usePage().props as unknown as {
        options: Options;
        success?: string;
    };

    const [activeKey, setActiveKey] = useState<ListKey>('jenis_sampah');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newItem, setNewItem] = useState('');
    const [confirm, setConfirm] = useState<{ open: boolean; title: string; message: string; onConfirm: () => void }>({
        open: false, title: '', message: '', onConfirm: () => {},
    });

    const [rincianArea, setRincianArea] = useState<RincianArea[]>(options.rincian_area ?? []);

    useEffect(() => {
        if (options.rincian_area) {
            setRincianArea(options.rincian_area);
        }
    }, [options.rincian_area]);

    const current = sections.find((s) => s.key === activeKey)!;

    const save = (next: Options) => {
        router.post('/admin/kelola-data', next, { preserveScroll: true });
    };

    const openAdd = (key: ListKey) => {
        setActiveKey(key);
        setNewItem('');
        setDialogOpen(true);
    };

    const addItem = () => {
        const name = newItem.trim();
        if (!name || options[activeKey].includes(name)) return;
        save({ ...options, [activeKey]: [...options[activeKey], name] });
        setNewItem('');
        setDialogOpen(false);
    };

    const openRemove = (key: ListKey, i: number) => {
        const name = options[key][i];
        const labelMap: Record<ListKey, string> = { jenis_sampah: 'jenis sampah', tujuan_distribusi: 'tujuan distribusi' };
        setConfirm({
            open: true,
            title: 'Hapus Data',
            message: `Yakin ingin menghapus ${labelMap[key]} "${name}"?`,
            onConfirm: () => {
                save({ ...options, [key]: options[key].filter((_, idx) => idx !== i) });
            },
        });
    };

    const saveRincianArea = () => {
        save({ ...options, rincian_area: rincianArea });
    };

    const totalLuas = rincianArea.reduce((sum, item) => sum + (Number(item.luas) || 0), 0);

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

                <div className="rounded-xl border bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-800">Rincian Luas Area</h3>
                        <Button type="button" onClick={saveRincianArea} className="bg-green-600 text-white hover:bg-green-700">
                            Simpan
                        </Button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Kelola luas area per klasifikasi</p>

                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-green-50/60">
                                    <th className="px-3 py-2 text-left text-xs font-semibold tracking-wide text-green-700 uppercase">Area</th>
                                    <th className="px-3 py-2 text-left text-xs font-semibold tracking-wide text-green-700 uppercase">Keterangan</th>
                                    <th className="px-3 py-2 text-right text-xs font-semibold tracking-wide text-green-700 uppercase">Luas (m&sup2;)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-green-100">
                                {rincianArea.map((item, i) => (
                                    <tr key={item.nama}>
                                        <td className="whitespace-nowrap px-3 py-2 font-medium text-green-800">{item.nama}</td>
                                        <td className="px-3 py-2">
                                            <Input
                                                value={item.deskripsi}
                                                onChange={(e) => {
                                                    const copy = [...rincianArea];
                                                    copy[i] = { ...copy[i], deskripsi: e.target.value };
                                                    setRincianArea(copy);
                                                }}
                                                className="h-9 text-sm"
                                                placeholder="Deskripsi area"
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <Input
                                                type="number"
                                                value={item.luas}
                                                onChange={(e) => {
                                                    const copy = [...rincianArea];
                                                    copy[i] = { ...copy[i], luas: Number(e.target.value) };
                                                    setRincianArea(copy);
                                                }}
                                                className="h-9 w-28 text-right text-sm"
                                                min={0}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="bg-green-50/40 font-semibold">
                                    <td className="px-3 py-2 text-green-900">Total</td>
                                    <td className="px-3 py-2 text-xs text-gray-500">Jumlah keseluruhan</td>
                                    <td className="px-3 py-2 text-right tabular-nums text-green-900">
                                        {totalLuas.toLocaleString('id-ID')} m&sup2;
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {sections.map((section) => (
                    <div key={section.key} className="rounded-xl border bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-800">Daftar {section.label}</h3>
                            <Button type="button" onClick={() => openAdd(section.key)} className="bg-green-600 text-white hover:bg-green-700">
                                <Plus className="mr-1 h-4 w-4" /> Tambah
                            </Button>
                        </div>

                        {options[section.key].length === 0 && (
                            <p className="mt-4 text-sm text-gray-500">Belum ada data.</p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2">
                            {options[section.key].map((item, i) => (
                                <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                                    {item}
                                    <button type="button" onClick={() => openRemove(section.key, i)} className="ml-0.5 rounded-full p-0.5 hover:bg-green-200">
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>{current.title}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-2">
                        <Label htmlFor="new-item">{current.label}</Label>
                        <Input
                            id="new-item"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            placeholder={current.placeholder}
                            className="h-12 text-base"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') addItem();
                            }}
                            autoFocus
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button type="button" onClick={addItem} disabled={!newItem.trim()} className="bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400 disabled:text-white/70">
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
