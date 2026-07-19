import { Head, router, useForm } from '@inertiajs/react';
import { Globe, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type PosterItem = {
    id: number;
    title: string;
    tag: string;
    image_url: string;
    order: number;
    is_published: boolean;
};

type Props = {
    posters: PosterItem[];
};

export default function KelolaPoster({ posters }: Props) {
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<PosterItem | null>(null);
    const [deletingItem, setDeletingItem] = useState<PosterItem | null>(null);
    const [deleteProcessing, setDeleteProcessing] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [editKey, setEditKey] = useState(0);

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [editPreview, setEditPreview] = useState<string | null>(null);

    const addForm = useForm({
        title: '',
        tag: '',
        image: null as File | null,
        order: 0,
        is_published: true,
    });

    const editForm = useForm({
        title: '',
        tag: '',
        image_url: '',
        image: null as File | null,
        order: 0,
        is_published: true,
    });

    function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        addForm.post('/admin/poster', {
            preserveScroll: true,
            onSuccess: () => {
                setAddOpen(false);
                if (imagePreview) URL.revokeObjectURL(imagePreview);
                setImagePreview(null);
                addForm.reset();
            },
        });
    }

    function openEdit(item: PosterItem) {
        setEditingItem(item);
        editForm.setData({
            title: item.title,
            tag: item.tag || item.title,
            image_url: item.image_url,
            image: null,
            order: item.order,
            is_published: item.is_published,
        });
        editForm.clearErrors();
        if (editPreview) URL.revokeObjectURL(editPreview);
        setEditPreview(null);
        setEditKey((k) => k + 1);
        setEditOpen(true);
    }

    function handleEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!editingItem) return;
        editForm.patch(`/admin/poster/${editingItem.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setEditOpen(false);
                setEditingItem(null);
                if (editPreview) URL.revokeObjectURL(editPreview);
                setEditPreview(null);
            },
        });
    }

    function handleDelete() {
        if (!deletingItem) return;
        setDeleteError(null);
        setDeleteProcessing(true);
        router.delete(`/admin/poster/${deletingItem.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteOpen(false);
                setDeletingItem(null);
                setDeleteProcessing(false);
            },
            onError: (errors) => {
                setDeleteProcessing(false);
                const msg = errors?.message ?? Object.values(errors)?.[0];
                setDeleteError(typeof msg === 'string' && msg ? msg : 'Poster gagal dihapus. Silakan coba kembali.');
            },
        });
    }

    return (
        <>
            <Head title="Kelola Poster Edukasi" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Kelola Poster Edukasi"
                        description="Atur poster edukasi yang tampil di halaman publik"
                    />
                    <Button
                        onClick={() => {
                            addForm.reset();
                            addForm.clearErrors();
                            if (imagePreview) URL.revokeObjectURL(imagePreview);
                            setImagePreview(null);
                            setAddOpen(true);
                        }}
                        className="bg-green-600 text-white hover:bg-green-700"
                    >
                        <Plus className="mr-2 size-4" />
                        Tambah Poster
                    </Button>
                </div>

                {posters.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-green-200 bg-green-50/50 p-16 text-center">
                        <Globe className="mx-auto mb-3 size-10 text-green-300" />
                        <p className="text-green-600/70">Belum ada poster.</p>
                    </div>
                ) : (
                    <div className="rounded-xl border border-green-200 bg-white shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-green-100 bg-green-50/30">
                                        <TableHead className="text-green-700 w-12">No</TableHead>
                                        <TableHead className="text-green-700">Judul</TableHead>
                                        <TableHead className="text-green-700 w-20">Gambar</TableHead>
                                        <TableHead className="text-green-700 w-20">Publish</TableHead>
                                        <TableHead className="text-green-700 w-16">Urutan</TableHead>
                                        <TableHead className="text-right text-green-700 w-40">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {posters.map((item, idx) => (
                                        <TableRow key={item.id} className="border-green-100">
                                            <TableCell className="text-green-600">{idx + 1}</TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                                                    {item.tag}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {item.image_url ? (
                                                    <img
                                                        src={item.image_url}
                                                        alt="preview"
                                                        className="size-10 rounded-md object-cover border border-green-100"
                                                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                                    />
                                                ) : (
                                                    <span className="text-xs text-green-400">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    item.is_published
                                                        ? 'bg-green-50 text-green-700 border border-green-200'
                                                        : 'bg-gray-50 text-gray-500 border border-gray-200'
                                                }`}>
                                                    {item.is_published ? 'Ya' : 'Tidak'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-sm text-green-600">{item.order}</TableCell>
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
                )}
            </div>

            <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Tambah Poster</DialogTitle>
                        <DialogDescription>
                            Tambah poster edukasi baru untuk halaman publik.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="add-tag">Judul</Label>
                            <Input
                                id="add-tag"
                                value={addForm.data.tag}
                                onChange={(e) => {
                                    addForm.setData('tag', e.target.value);
                                    addForm.setData('title', e.target.value);
                                }}
                                placeholder="Contoh: 5R, Pilah dari Sumbernya, dst"
                                required
                                className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                            />
                            {addForm.errors.tag && (
                                <p className="text-sm text-red-500">{addForm.errors.tag}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="add-image">Gambar</Label>
                            <Input
                                id="add-image"
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null;
                                    if (file && file.size > 2 * 1024 * 1024) {
                                        alert('Ukuran gambar terlalu besar. Maksimal 2 MB.');
                                        e.target.value = '';
                                        return;
                                    }
                                    addForm.setData('image', file);
                                    if (imagePreview) URL.revokeObjectURL(imagePreview);
                                    setImagePreview(file ? URL.createObjectURL(file) : null);
                                }}
                                required
                                className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20 file:mr-3 file:rounded-md file:border-0 file:bg-green-600 file:px-3 file:py-1 file:text-white file:hover:bg-green-700"
                            />
                            {addForm.errors.image && (
                                <p className="text-sm text-red-500">{addForm.errors.image}</p>
                            )}
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="preview"
                                    className="mt-1 h-20 rounded-md object-cover border border-green-100"
                                />
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="add-publish"
                                    checked={addForm.data.is_published}
                                    onCheckedChange={(v) => addForm.setData('is_published', !!v)}
                                />
                                <Label htmlFor="add-publish">Publikasikan</Label>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="add-order">Urutan</Label>
                                <Input
                                    id="add-order"
                                    type="number"
                                    min={0}
                                    value={addForm.data.order}
                                    onChange={(e) => addForm.setData('order', parseInt(e.target.value) || 0)}
                                    className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                                />
                            </div>
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

            <Dialog key={editKey} open={editOpen} onOpenChange={(open) => {
                if (!open) {
                    if (editPreview) URL.revokeObjectURL(editPreview);
                    setEditPreview(null);
                }
                setEditOpen(open);
            }}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Poster</DialogTitle>
                        <DialogDescription>
                            Ubah data poster edukasi.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEdit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-tag">Judul</Label>
                            <Input
                                id="edit-tag"
                                value={editForm.data.tag}
                                onChange={(e) => {
                                    editForm.setData('tag', e.target.value);
                                    editForm.setData('title', e.target.value);
                                }}
                                placeholder="Contoh: 5R, Pilah dari Sumbernya, dst"
                                required
                                className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                            />
                            {editForm.errors.tag && (
                                <p className="text-sm text-red-500">{editForm.errors.tag}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            {editingItem?.image_url && !editPreview && (
                                <div>
                                    <p className="mb-2 text-sm text-green-700">Gambar saat ini</p>
                                    <img
                                        src={editingItem.image_url}
                                        alt="Current poster"
                                        className="h-32 w-auto rounded-lg border border-green-100 object-contain"
                                    />
                                </div>
                            )}
                            <Label htmlFor="edit-image">Ganti Gambar</Label>
                            <Input
                                id="edit-image"
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null;
                                    if (file && file.size > 2 * 1024 * 1024) {
                                        alert('Ukuran gambar terlalu besar. Maksimal 2 MB.');
                                        e.target.value = '';
                                        return;
                                    }
                                    editForm.setData('image', file);
                                    if (editPreview) URL.revokeObjectURL(editPreview);
                                    setEditPreview(file ? URL.createObjectURL(file) : null);
                                }}
                                className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20 file:mr-3 file:rounded-md file:border-0 file:bg-green-600 file:px-3 file:py-1 file:text-white file:hover:bg-green-700"
                            />
                            {editForm.errors.image && (
                                <p className="text-sm text-red-500">{editForm.errors.image}</p>
                            )}
                            {editPreview && (
                                <img
                                    src={editPreview}
                                    alt="preview"
                                    className="mt-1 h-20 rounded-md object-cover border border-green-100"
                                />
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="edit-publish"
                                    checked={editForm.data.is_published}
                                    onCheckedChange={(v) => editForm.setData('is_published', !!v)}
                                />
                                <Label htmlFor="edit-publish">Publikasikan</Label>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-order">Urutan</Label>
                                <Input
                                    id="edit-order"
                                    type="number"
                                    min={0}
                                    value={editForm.data.order}
                                    onChange={(e) => editForm.setData('order', parseInt(e.target.value) || 0)}
                                    className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                                />
                            </div>
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

            <Dialog open={deleteOpen} onOpenChange={(open) => { if (!open) { setDeleteError(null); } setDeleteOpen(open); }}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Hapus Poster</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus poster ini secara permanen? Data yang telah dihapus tidak dapat dikembalikan.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
                        <strong>{deletingItem?.title}</strong>
                    </div>
                    {deleteError && (
                        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                            {deleteError}
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => { setDeleteError(null); setDeleteOpen(false); }}
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