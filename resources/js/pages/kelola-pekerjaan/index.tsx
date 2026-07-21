import { Head, router, useForm } from '@inertiajs/react';
import { Circle, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { baseUrl } from '@/lib/path';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type MasterPekerjaan = {
    id: number;
    nama_pekerjaan: string;
    jenis_pekerjaan: string;
    urutan: number;
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
        default: return val;
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

type Props = {
    pekerjaan: MasterPekerjaan[];
    filter: string | null;
};

const FILTERS = [
    { value: null as string | null, label: 'Semua Pekerjaan' },
    { value: 'harian', label: 'Harian' },
    { value: 'mingguan', label: 'Mingguan' },
    { value: 'bulanan', label: 'Bulanan' },
];

export default function KelolaPekerjaan({ pekerjaan, filter }: Props) {
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MasterPekerjaan | null>(null);
    const [deletingItem, setDeletingItem] = useState<MasterPekerjaan | null>(null);
    const [deleteProcessing, setDeleteProcessing] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [editKey, setEditKey] = useState(0);
    const [activeFilter, setActiveFilter] = useState<string | null>(filter);

    const addForm = useForm({
        nama_pekerjaan: '',
        jenis_pekerjaan: 'harian' as string,
    });

    const editForm = useForm({
        nama_pekerjaan: '',
        jenis_pekerjaan: 'harian' as string,
    });

    function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        addForm.post(baseUrl('/admin/kelola-pekerjaan'), {
            preserveScroll: true,
            onSuccess: () => {
                setAddOpen(false);
                addForm.reset();
            },
        });
    }

    function openEdit(item: MasterPekerjaan) {
        setEditingItem(item);
        editForm.setData({
            nama_pekerjaan: item.nama_pekerjaan,
            jenis_pekerjaan: item.jenis_pekerjaan,
        });
        editForm.clearErrors();
        setEditKey((k) => k + 1);
        setEditOpen(true);
    }

    function handleEdit(e: React.FormEvent) {
        e.preventDefault();

        if (!editingItem) {
return;
}

        editForm.patch(baseUrl(`/admin/kelola-pekerjaan/${editingItem.id}`), {
            preserveScroll: true,
            onSuccess: () => {
                setEditOpen(false);
                setEditingItem(null);
            },
        });
    }

    function handleDelete() {
        if (!deletingItem) {
return;
}

        setDeleteError(null);
        setDeleteProcessing(true);
        router.delete(baseUrl(`/admin/kelola-pekerjaan/${deletingItem.id}`), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteOpen(false);
                setDeletingItem(null);
                setDeleteProcessing(false);
            },
            onError: (errors) => {
                setDeleteProcessing(false);
                const msg = errors?.message ?? Object.values(errors)?.[0];
                setDeleteError(typeof msg === 'string' && msg ? msg : 'Pekerjaan gagal dihapus. Silakan coba kembali.');
            },
        });
    }

    function handleFilterChange(value: string | null) {
        setActiveFilter(value);
        router.get(
            '/admin/kelola-pekerjaan',
            value ? { jenis: value } : {},
            { preserveScroll: true, preserveState: true },
        );
    }

    const grouped: Record<string, MasterPekerjaan[]> = {};

    for (const key of GROUP_ORDER) {
        const tasks = pekerjaan
            .filter((t) => t.jenis_pekerjaan === key)
            .sort((a, b) => a.urutan - b.urutan || a.id - b.id);

        if (activeFilter === null || activeFilter === key) {
            grouped[key] = tasks;
        } else {
            grouped[key] = [];
        }
    }

    const hasAny = Object.values(grouped).some((g) => g.length > 0);

    return (
        <>
            <Head title="Kelola Pekerjaan" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Kelola Pekerjaan"
                        description="Atur daftar pekerjaan kebersihan"
                    />
                    <Button
                        onClick={() => {
                            addForm.reset();
                            addForm.clearErrors();
                            setAddOpen(true);
                        }}
                        className="bg-green-600 text-white hover:bg-green-700"
                    >
                        <Plus className="mr-2 size-4" />
                        Tambah Pekerjaan
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-medium text-green-700">Filter Jenis Pekerjaan</span>
                    <div className="inline-flex overflow-hidden rounded-xl border border-green-200 bg-white shadow-sm">
                        {FILTERS.map((f) => (
                            <button
                                key={f.value ?? 'all'}
                                type="button"
                                onClick={() => handleFilterChange(f.value)}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${
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

                {!hasAny ? (
                    <div className="rounded-xl border border-dashed border-green-200 bg-green-50/50 p-16 text-center">
                        <p className="text-green-600/70">Tidak ada pekerjaan.</p>
                    </div>
                ) : (
                    <>
                        {GROUP_ORDER.map((key) => {
                            const tasks = grouped[key];

                            if (tasks.length === 0 && activeFilter !== null && activeFilter !== key) {
                                return null;
                            }

                            if (tasks.length === 0 && activeFilter === key) {
                                return (
                                    <div key={key} className="rounded-xl border border-green-200 bg-white shadow-sm overflow-hidden">
                                        <div className={`border-l-4 px-4 py-3 ${groupHeaderClass[key]}`}>
                                            <div className="flex items-center gap-2">
                                                <Circle className={`size-3 fill-current ${groupDotClass[key]}`} />
                                                <span className="font-semibold">{groupLabel[key]}</span>
                                                <span className="ml-auto text-sm opacity-70">0 tugas</span>
                                            </div>
                                        </div>
                                        <div className="p-8 text-center text-sm text-green-600/70">
                                            Belum ada pekerjaan {key}.
                                        </div>
                                    </div>
                                );
                            }

                            if (tasks.length === 0) {
return null;
}

                            return (
                                <div key={key} className="rounded-xl border border-green-200 bg-white shadow-sm overflow-hidden">
                                    <div className={`border-l-4 px-4 py-3 ${groupHeaderClass[key]}`}>
                                        <div className="flex items-center gap-2">
                                            <Circle className={`size-3 fill-current ${groupDotClass[key]}`} />
                                            <span className="font-semibold">{groupLabel[key]}</span>
                                            <span className="ml-auto text-sm opacity-70">{tasks.length} tugas</span>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="border-green-100 bg-green-50/30">
                                                    <TableHead className="text-green-700 w-12">No</TableHead>
                                                    <TableHead className="text-green-700">Nama Pekerjaan</TableHead>
                                                    <TableHead className="text-green-700 w-36">Jenis Pekerjaan</TableHead>
                                                    <TableHead className="text-right text-green-700 w-40">Aksi</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {tasks.map((item) => (
                                                    <TableRow key={item.id} className="border-green-100">
                                                        <TableCell className="text-green-600">{item.urutan}</TableCell>
                                                        <TableCell className="font-medium text-green-900">
                                                            {item.nama_pekerjaan}
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${jenisBadgeClass[jenisLabel(item.jenis_pekerjaan)] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                                {jenisLabel(item.jenis_pekerjaan)}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => openEdit(item)}
                                                                    className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                                                                >
                                                                    <Pencil className="h-3.5 w-3.5" />
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setDeleteError(null);
                                                                        setDeletingItem(item);
                                                                        setDeleteOpen(true);
                                                                    }}
                                                                    className="flex items-center gap-1"
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                    Hapus
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}
            </div>

            <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Tambah Pekerjaan</DialogTitle>
                        <DialogDescription>
                            Tambah pekerjaan kebersihan baru.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="add-nama">Nama Pekerjaan</Label>
                            <Input
                                id="add-nama"
                                value={addForm.data.nama_pekerjaan}
                                onChange={(e) => addForm.setData('nama_pekerjaan', e.target.value)}
                                required
                                className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                            />
                            {addForm.errors.nama_pekerjaan && (
                                <p className="text-sm text-red-500">{addForm.errors.nama_pekerjaan}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="add-jenis">Jenis Pekerjaan</Label>
                            <Select
                                value={addForm.data.jenis_pekerjaan}
                                onValueChange={(v) => addForm.setData('jenis_pekerjaan', v)}
                            >
                                <SelectTrigger id="add-jenis" className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="harian">Harian</SelectItem>
                                    <SelectItem value="mingguan">Mingguan</SelectItem>
                                    <SelectItem value="bulanan">Bulanan</SelectItem>
                                </SelectContent>
                            </Select>
                            {addForm.errors.jenis_pekerjaan && (
                                <p className="text-sm text-red-500">{addForm.errors.jenis_pekerjaan}</p>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setAddOpen(false)}
                                className="border-green-200 text-green-700 hover:bg-green-50"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={addForm.processing}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                Simpan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog key={editKey} open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Pekerjaan</DialogTitle>
                        <DialogDescription>
                            Ubah data pekerjaan.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEdit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-nama">Nama Pekerjaan</Label>
                            <Input
                                id="edit-nama"
                                value={editForm.data.nama_pekerjaan}
                                onChange={(e) => editForm.setData('nama_pekerjaan', e.target.value)}
                                required
                                className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                            />
                            {editForm.errors.nama_pekerjaan && (
                                <p className="text-sm text-red-500">{editForm.errors.nama_pekerjaan}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-jenis">Jenis Pekerjaan</Label>
                            <Select
                                value={editForm.data.jenis_pekerjaan}
                                onValueChange={(v) => editForm.setData('jenis_pekerjaan', v)}
                            >
                                <SelectTrigger id="edit-jenis" className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="harian">Harian</SelectItem>
                                    <SelectItem value="mingguan">Mingguan</SelectItem>
                                    <SelectItem value="bulanan">Bulanan</SelectItem>
                                </SelectContent>
                            </Select>
                            {editForm.errors.jenis_pekerjaan && (
                                <p className="text-sm text-red-500">{editForm.errors.jenis_pekerjaan}</p>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditOpen(false)}
                                className="border-green-200 text-green-700 hover:bg-green-50"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                Simpan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={deleteOpen} onOpenChange={(open) => {
 if (!open) {
 setDeleteError(null); 
}

 setDeleteOpen(open); 
}}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Hapus Pekerjaan</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus pekerjaan ini secara permanen? Data yang telah dihapus tidak dapat dikembalikan.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
                        <strong>{deletingItem?.nama_pekerjaan}</strong>
                    </div>
                    {deleteError && (
                        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                            {deleteError}
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
 setDeleteError(null); setDeleteOpen(false); 
}}
                            disabled={deleteProcessing}
                            className="border-green-200 text-green-700 hover:bg-green-50"
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteProcessing}
                        >
                            {deleteProcessing ? 'Memproses...' : 'Hapus Permanen'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
