import { Head, useForm } from '@inertiajs/react';
import { FileText, Upload, Trash2, FileDown, Eye } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { baseUrl } from '@/lib/path';

type DocumentItem = {
    id: number;
    type: string;
    title: string;
    pdf_url: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
};

type Props = {
    documents: Record<string, DocumentItem | undefined>;
};

const DOC_TYPES = [
    { key: 'peraturan', label: 'Peraturan', description: 'Dokumen PDF halaman Peraturan' },
    { key: 'struktur', label: 'Struktur Organisasi', description: 'Dokumen PDF halaman Struktur Organisasi' },
    { key: 'sop', label: 'SOP', description: 'Dokumen PDF halaman Standard Operating Procedure' },
] as const;

function formatFileSize(bytes: number): string {
    if (bytes < 1024) {
return bytes + ' B';
}

    if (bytes < 1024 * 1024) {
return (bytes / 1024).toFixed(1) + ' KB';
}

    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function KelolaDokumen({ documents }: Props) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletingType, setDeletingType] = useState<string | null>(null);
    const [deleteProcessing, setDeleteProcessing] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const uploadForm = useForm({
        type: '',
        title: 'Dokumen',
        pdf: null as File | null,
        is_published: true,
    });

    const replaceForm = useForm({
        title: '',
        pdf: null as File | null,
        is_published: true,
        _method: 'PATCH',
    });

    const [replaceType, setReplaceType] = useState<string | null>(null);

    function openUpload(type: string) {
        uploadForm.reset();
        uploadForm.clearErrors();
        uploadForm.setData({
            ...uploadForm.data,
            type,
            title: DOC_TYPES.find((d) => d.key === type)?.label ?? 'Dokumen',
        });
    }

    function openReplace(type: string) {
        const doc = documents[type];

        if (!doc) {
return;
}

        replaceForm.reset();
        replaceForm.clearErrors();
        replaceForm.setData({
            title: doc.title,
            pdf: null,
            is_published: doc.is_published,
            _method: 'PATCH',
        });
        setReplaceType(type);
    }

    function handleReplace(e: React.FormEvent) {
        e.preventDefault();

        if (!replaceType) {
return;
}

        const doc = documents[replaceType];

        if (!doc) {
return;
}

        replaceForm.patch(baseUrl(`/admin/dokumen/${doc.id}`), {
            preserveScroll: true,
            onSuccess: () => {
                setReplaceType(null);
                replaceForm.reset();
            },
        });
    }

    function confirmDelete(type: string) {
        setDeleteError(null);
        setDeletingType(type);
        setDeleteOpen(true);
    }

    function handleDelete() {
        if (!deletingType) {
return;
}

        const doc = documents[deletingType];

        if (!doc) {
return;
}

        setDeleteError(null);
        setDeleteProcessing(true);
        uploadForm.delete(baseUrl(`/admin/dokumen/${doc.id}`), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteOpen(false);
                setDeletingType(null);
                setDeleteProcessing(false);
            },
            onError: (errors) => {
                setDeleteProcessing(false);
                const msg = errors?.message ?? Object.values(errors)?.[0];
                setDeleteError(typeof msg === 'string' && msg ? msg : 'Dokumen gagal dihapus. Silakan coba kembali.');
            },
        });
    }

    return (
        <>
            <Head title="Kelola Dokumen Website" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Kelola Dokumen Website"
                    description="Upload dan kelola dokumen PDF untuk halaman Peraturan, Struktur, dan SOP"
                />

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {DOC_TYPES.map(({ key, label, description }) => {
                        const doc = documents[key];

                        return (
                            <div
                                key={key}
                                className="rounded-xl border border-green-200 bg-white shadow-sm"
                            >
                                <div className="border-b border-green-100 bg-green-50/50 px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 items-center justify-center rounded-lg bg-green-100">
                                            <FileText className="size-5 text-green-700" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-green-900">{label}</h3>
                                            <p className="text-xs text-green-600/70">{description}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-5 py-4">
                                    {doc ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-xs">
                                                <FileText className="size-3.5 shrink-0 text-green-600" />
                                                <span className="truncate font-medium text-green-800">{doc.title}.pdf</span>
                                            </div>

                                            <p className="text-xs text-green-600/70">
                                                Diperbarui: {new Date(doc.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>

                                            <div className="flex items-center gap-1">
                                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                                    doc.is_published
                                                        ? 'bg-green-50 text-green-700 border border-green-200'
                                                        : 'bg-gray-50 text-gray-500 border border-gray-200'
                                                }`}>
                                                    {doc.is_published ? 'Dipublikasi' : 'Draft'}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-2 pt-1">
                                                <a
                                                    href={doc.pdf_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                        Lihat
                                                    </Button>
                                                </a>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openReplace(key)}
                                                    className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                                                >
                                                    <Upload className="h-3.5 w-3.5" />
                                                    Ganti
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => confirmDelete(key)}
                                                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    Hapus
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="flex flex-col items-center gap-2 rounded-md border border-dashed border-green-200 bg-green-50/30 px-4 py-6 text-center">
                                                <FileDown className="size-8 text-green-300" />
                                                <p className="text-xs text-green-600/70">Belum ada dokumen PDF</p>
                                            </div>

                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();

                                                    if (!uploadForm.data.pdf) {
return;
}

                                                    uploadForm.post(baseUrl('/admin/dokumen'), {
                                                        preserveScroll: true,
                                                        onSuccess: () => {
                                                            uploadForm.reset();
                                                        },
                                                    });
                                                }}
                                                className="space-y-3"
                                            >
                                                <div>
                                                    <Label htmlFor={`upload-${key}`} className="sr-only">
                                                        Pilih file PDF
                                                    </Label>
                                                    <Input
                                                        id={`upload-${key}`}
                                                        type="file"
                                                        accept="application/pdf"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0] ?? null;

                                                            if (file && file.size > 10 * 1024 * 1024) {
                                                                alert('Ukuran file terlalu besar. Maksimal 10 MB.');
                                                                e.target.value = '';

                                                                return;
                                                            }

                                                            uploadForm.setData('pdf', file);
                                                            uploadForm.setData('type', key);
                                                            uploadForm.setData('title', label);
                                                        }}
                                                        className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20 file:mr-3 file:rounded-md file:border-0 file:bg-green-600 file:px-3 file:py-1 file:text-xs file:text-white file:hover:bg-green-700"
                                                    />
                                                    {uploadForm.errors.pdf && (
                                                        <p className="mt-1 text-xs text-red-500">{uploadForm.errors.pdf}</p>
                                                    )}
                                                    {uploadForm.errors.type && (
                                                        <p className="mt-1 text-xs text-red-500">{uploadForm.errors.type}</p>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        id={`publish-${key}`}
                                                        checked={uploadForm.data.is_published}
                                                        onCheckedChange={(v) => uploadForm.setData('is_published', !!v)}
                                                    />
                                                    <Label htmlFor={`publish-${key}`} className="text-xs text-green-700">
                                                        Publikasikan
                                                    </Label>
                                                </div>

                                                <Button
                                                    type="submit"
                                                    size="sm"
                                                    disabled={uploadForm.processing || !uploadForm.data.pdf}
                                                    className="w-full bg-green-600 hover:bg-green-700"
                                                >
                                                    <Upload className="h-3.5 w-3.5" />
                                                    Upload PDF
                                                </Button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Dialog open={!!replaceType} onOpenChange={(open) => {
 if (!open) {
setReplaceType(null);
} 
}}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Ganti Dokumen</DialogTitle>
                        <DialogDescription>
                            Upload PDF baru untuk mengganti dokumen {DOC_TYPES.find((d) => d.key === replaceType)?.label ?? ''}.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleReplace} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="replace-title">Judul Dokumen</Label>
                            <Input
                                id="replace-title"
                                value={replaceForm.data.title}
                                onChange={(e) => replaceForm.setData('title', e.target.value)}
                                required
                                className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="replace-pdf">File PDF Baru</Label>
                            <Input
                                id="replace-pdf"
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null;

                                    if (file && file.size > 10 * 1024 * 1024) {
                                        alert('Ukuran file terlalu besar. Maksimal 10 MB.');
                                        e.target.value = '';

                                        return;
                                    }

                                    replaceForm.setData('pdf', file);
                                }}
                                className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20 file:mr-3 file:rounded-md file:border-0 file:bg-green-600 file:px-3 file:py-1 file:text-xs file:text-white file:hover:bg-green-700"
                            />
                            {replaceForm.errors.pdf && (
                                <p className="text-sm text-red-500">{replaceForm.errors.pdf}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="replace-publish"
                                checked={replaceForm.data.is_published}
                                onCheckedChange={(v) => replaceForm.setData('is_published', !!v)}
                            />
                            <Label htmlFor="replace-publish">Publikasikan</Label>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setReplaceType(null)}
                                className="border-green-200 text-green-700 hover:bg-green-50"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={replaceForm.processing}
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
                        <DialogTitle>Hapus Dokumen</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus dokumen ini? Dokumen yang telah dihapus tidak dapat dikembalikan.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
                        <strong>{DOC_TYPES.find((d) => d.key === deletingType)?.label ?? deletingType}</strong>
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
