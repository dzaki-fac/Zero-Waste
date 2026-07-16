import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Eye,
    EyeOff,
    Pencil,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
import { cn } from '@/lib/utils';
import type { Auth } from '@/types';

type UserResource = {
    id: number;
    name: string;
    nip: string | null;
    email: string;
    role: string;
};

type PaginatedResponse<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
};

type PageProps = {
    auth: Auth;
    users: PaginatedResponse<UserResource>;
    filters: { role?: string; search?: string };
    current_user_id: number;
    current_user_role: string;
};

const roleLabel = (role: string) => {
    switch (role) {
        case 'admin':
            return 'Admin';
        case 'petugas':
            return 'Petugas';
        default:
            return role;
    }
};

const FILTERS = [
    { value: 'all', label: 'Semua' },
    { value: 'admin', label: 'Admin' },
    { value: 'petugas', label: 'Petugas' },
];

export default function AdminAccounts() {
    const { users, filters, current_user_id } =
        usePage<PageProps>().props;
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserResource | null>(null);
    const [deletingUser, setDeletingUser] = useState<UserResource | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showEditPassword, setShowEditPassword] = useState(false);
    const [deleteProcessing, setDeleteProcessing] = useState(false);

    const addForm = useForm({
        name: '',
        email: '',
        nip: '',
        password: '',
        password_confirmation: '',
        role: 'petugas' as string,
    });

    const editForm = useForm({
        name: '',
        email: '',
        nip: '',
        password: '',
        password_confirmation: '',
        role: 'petugas' as string,
    });

    const [searchInput, setSearchInput] = useState(filters.search ?? '');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSearchInput(filters.search ?? '');
    }, [filters.search]);

    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    const activeFilter = filters.role ?? 'all';

    function handleSearchInput(value: string) {
        setSearchInput(value);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            router.get(
                '/admin/akun',
                {
                    search: value || undefined,
                    role: activeFilter !== 'all' ? activeFilter : undefined,
                },
                { preserveScroll: true, preserveState: true },
            );
        }, 400);
    }

    function openEdit(user: UserResource) {
        setEditingUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            nip: user.nip ?? '',
            password: '',
            password_confirmation: '',
            role: user.role,
        });
        editForm.clearErrors();
        setShowEditPassword(false);
        setEditOpen(true);
    }

    function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        addForm.post('/admin/akun', {
            preserveScroll: true,
            onSuccess: () => {
                setAddOpen(false);
                addForm.reset();
                setShowPassword(false);
            },
        });
    }

    function handleEdit(e: React.FormEvent) {
        e.preventDefault();

        if (!editingUser) {
            return;
        }

        editForm.patch(`/akun/${editingUser.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setEditOpen(false);
                setEditingUser(null);
            },
        });
    }

    function handleDelete() {
        if (!deletingUser) {
            return;
        }

        setDeleteProcessing(true);
        router.delete(`/akun/${deletingUser.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteOpen(false);
                setDeletingUser(null);
                setDeleteProcessing(false);
            },
            onError: () => setDeleteProcessing(false),
        });
    }

    function handleFilterChange(value: string) {
        router.get(
            '/admin/akun',
            {
                role: value === 'all' ? undefined : value,
                search: searchInput || undefined,
            },
            { preserveScroll: true, preserveState: true },
        );
    }

    function goToPage(page: number) {
        router.get(
            '/admin/akun',
            { page, ...filters },
            { preserveScroll: true },
        );
    }

    function canDelete(user: UserResource) {
        if (user.id === current_user_id) {
            return false;
        }

        return true;
    }

    return (
        <>
            <Head title="Daftar Akun" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Daftar Akun"
                        description="Kelola akun admin dan petugas"
                    />

                    <Button
                        onClick={() => {
                            addForm.reset();
                            addForm.clearErrors();
                            setShowPassword(false);
                            setAddOpen(true);
                        }}
                        className="bg-green-600 text-white hover:bg-green-700"
                    >
                        <Plus className="mr-2 size-4" />
                        Tambah Akun
                    </Button>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="inline-flex overflow-hidden rounded-xl border border-green-200 bg-white shadow-sm">
                        {FILTERS.map((f) => (
                            <button
                                key={f.value}
                                type="button"
                                onClick={() => handleFilterChange(f.value)}
                                className={cn(
                                    'px-4 py-2 text-sm font-medium transition-colors',
                                    activeFilter === f.value
                                        ? 'bg-green-600 text-white'
                                        : 'text-green-700 hover:bg-green-50',
                                )}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-400" />
                        <Input
                            placeholder="Cari nama, email, atau NIP"
                            value={searchInput}
                            onChange={(e) => handleSearchInput(e.target.value)}
                            className="border-green-200 pl-9 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                        />
                    </div>
                </div>

                <div className="rounded-xl border border-green-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-green-100 bg-green-50/50">
                                    <TableHead className="text-green-700">No</TableHead>
                                    <TableHead className="text-green-700">Nama</TableHead>
                                    <TableHead className="text-green-700">NIP</TableHead>
                                    <TableHead className="text-green-700">Email</TableHead>
                                    <TableHead className="text-green-700">Role</TableHead>
                                    <TableHead className="text-right text-green-700">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-green-600/70">
                                            Tidak ada akun.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.data.map((user, index) => {
                                        const rowNum =
                                            users.from !== null
                                                ? users.from + index
                                                : index + 1;

                                        return (
                                            <TableRow
                                                key={user.id}
                                                className={cn(
                                                    'border-green-100',
                                                    user.id === current_user_id &&
                                                        'bg-green-50/40',
                                                )}
                                            >
                                                <TableCell className="text-green-600">{rowNum}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-green-900">
                                                            {user.name}
                                                        </span>
                                                        {user.id === current_user_id && (
                                                            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                                                                Anda
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-green-600">
                                                    {user.nip ?? '-'}
                                                </TableCell>
                                                <TableCell className="text-green-600">
                                                    {user.email}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                                                        {roleLabel(user.role)}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openEdit(user)}
                                                            className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                                                        >
                                                            <Pencil className="h-3.5 w-3.5" />
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => {
                                                                setDeletingUser(user);
                                                                setDeleteOpen(true);
                                                            }}
                                                            disabled={!canDelete(user)}
                                                            className="flex items-center gap-1"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                            Hapus
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {users.last_page > 1 && (
                        <div className="flex flex-col gap-3 border-t border-green-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-green-600/70">
                                Menampilkan {users.from}–{users.to} dari{' '}
                                {users.total} akun
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    disabled={users.current_page === 1}
                                    onClick={() =>
                                        goToPage(users.current_page - 1)
                                    }
                                    className="inline-flex items-center justify-center rounded-lg border border-green-200 bg-white p-2 text-green-600 transition-colors hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ChevronLeft className="size-4" />
                                </button>
                                {Array.from(
                                    { length: users.last_page },
                                    (_, i) => i + 1,
                                ).map((page) => (
                                    <button
                                        key={page}
                                        type="button"
                                        onClick={() => goToPage(page)}
                                        className={cn(
                                            'inline-flex size-9 items-center justify-center rounded-lg text-sm font-medium transition-colors',
                                            page === users.current_page
                                                ? 'bg-green-600 text-white shadow-sm'
                                                : 'text-green-600 hover:bg-green-100',
                                        )}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    disabled={
                                        users.current_page === users.last_page
                                    }
                                    onClick={() =>
                                        goToPage(users.current_page + 1)
                                    }
                                    className="inline-flex items-center justify-center rounded-lg border border-green-200 bg-white p-2 text-green-600 transition-colors hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ChevronRight className="size-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Modal */}
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Tambah Akun</DialogTitle>
                        <DialogDescription>
                            Buat akun admin atau petugas baru.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="add-name">Nama</Label>
                            <Input
                                id="add-name"
                                value={addForm.data.name}
                                onChange={(e) =>
                                    addForm.setData('name', e.target.value)
                                }
                                required
                                className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                            />
                            {addForm.errors.name && (
                                <p className="text-sm text-red-500">
                                    {addForm.errors.name}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="add-email">Email</Label>
                            <Input
                                id="add-email"
                                type="email"
                                value={addForm.data.email}
                                onChange={(e) =>
                                    addForm.setData('email', e.target.value)
                                }
                                required
                                className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                            />
                            {addForm.errors.email && (
                                <p className="text-sm text-red-500">
                                    {addForm.errors.email}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="add-nip">NIP</Label>
                            <Input
                                id="add-nip"
                                value={addForm.data.nip}
                                onChange={(e) =>
                                    addForm.setData('nip', e.target.value)
                                }
                                placeholder="(opsional)"
                                className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                            />
                            {addForm.errors.nip && (
                                <p className="text-sm text-red-500">
                                    {addForm.errors.nip}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="add-role">Role</Label>
                            <Select
                                value={addForm.data.role}
                                onValueChange={(v) =>
                                    addForm.setData('role', v)
                                }
                            >
                                <SelectTrigger id="add-role" className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">
                                        Admin
                                    </SelectItem>
                                    <SelectItem value="petugas">
                                        Petugas
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {addForm.errors.role && (
                                <p className="text-sm text-red-500">
                                    {addForm.errors.role}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="add-password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="add-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={addForm.data.password}
                                    onChange={(e) =>
                                        addForm.setData(
                                            'password',
                                            e.target.value,
                                        )
                                    }
                                    required
                                    className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 hover:text-green-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>
                            </div>
                            {addForm.errors.password && (
                                <p className="text-sm text-red-500">
                                    {addForm.errors.password}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="add-password-confirmation">
                                Konfirmasi Password
                            </Label>
                            <Input
                                id="add-password-confirmation"
                                type="password"
                                value={addForm.data.password_confirmation}
                                onChange={(e) =>
                                    addForm.setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                required
                                className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                            />
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

            {/* Edit Modal */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Akun</DialogTitle>
                        <DialogDescription>
                            Ubah data akun {editingUser?.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEdit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Nama</Label>
                            <Input
                                id="edit-name"
                                value={editForm.data.name}
                                onChange={(e) =>
                                    editForm.setData('name', e.target.value)
                                }
                                required
                                className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                            />
                            {editForm.errors.name && (
                                <p className="text-sm text-red-500">
                                    {editForm.errors.name}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-email">Email</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={editForm.data.email}
                                onChange={(e) =>
                                    editForm.setData('email', e.target.value)
                                }
                                required
                                className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                            />
                            {editForm.errors.email && (
                                <p className="text-sm text-red-500">
                                    {editForm.errors.email}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-nip">NIP</Label>
                            <Input
                                id="edit-nip"
                                value={editForm.data.nip}
                                onChange={(e) =>
                                    editForm.setData('nip', e.target.value)
                                }
                                placeholder="(opsional)"
                                className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                            />
                            {editForm.errors.nip && (
                                <p className="text-sm text-red-500">
                                    {editForm.errors.nip}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-role">Role</Label>
                            <Select
                                value={editForm.data.role}
                                onValueChange={(v) =>
                                    editForm.setData('role', v)
                                }
                                disabled={
                                    editingUser
                                        ? editingUser.id === current_user_id
                                        : false
                                }
                            >
                                <SelectTrigger id="edit-role" className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">
                                        Admin
                                    </SelectItem>
                                    <SelectItem value="petugas">
                                        Petugas
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {editForm.errors.role && (
                                <p className="text-sm text-red-500">
                                    {editForm.errors.role}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-password">
                                Password baru{' '}
                                <span className="font-normal text-green-400">
                                    (kosongkan jika tidak diubah)
                                </span>
                            </Label>
                            <div className="relative">
                                <Input
                                    id="edit-password"
                                    type={
                                        showEditPassword ? 'text' : 'password'
                                    }
                                    value={editForm.data.password}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'password',
                                            e.target.value,
                                        )
                                    }
                                    autoComplete="new-password"
                                    className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowEditPassword(!showEditPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 hover:text-green-600"
                                >
                                    {showEditPassword ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>
                            </div>
                            {editForm.errors.password && (
                                <p className="text-sm text-red-500">
                                    {editForm.errors.password}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-password-confirmation">
                                Konfirmasi Password Baru
                            </Label>
                            <Input
                                id="edit-password-confirmation"
                                type="password"
                                value={editForm.data.password_confirmation}
                                onChange={(e) =>
                                    editForm.setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                autoComplete="new-password"
                                className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                            />
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

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Hapus Akun</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus akun{' '}
                            <strong>{deletingUser?.name}</strong>? Tindakan ini
                            tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteOpen(false)}
                            className="border-green-200 text-green-700 hover:bg-green-50"
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteProcessing}
                        >
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
