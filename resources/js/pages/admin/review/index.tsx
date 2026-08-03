import { Head, router, usePage } from '@inertiajs/react';
import {
    Star, Search, Eye, EyeOff, CheckCircle2,
    Trash2, Undo2, Plus, Pencil,
    ChevronDown, ChevronRight,
} from 'lucide-react';
import { useState, useCallback, useEffect, useRef } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type SubArea = {
    id: number;
    area_id: number;
    name: string;
    description: string | null;
    sort_order: number;
    is_active: boolean;
};

type Area = {
    id: number;
    name: string;
    description: string | null;
    sort_order: number;
    is_active: boolean;
    sub_areas: SubArea[];
    area_reviews_count: number;
};

type ReviewUser = {
    id: number;
    name: string;
};

type Review = {
    id: number;
    area_id: number;
    sub_area_id: number | null;
    user_id: number | null;
    rating: number;
    comment: string;
    status: string;
    approved_at: string | null;
    approved_by: number | null;
    created_at: string;
    area: Area | null;
    sub_area: SubArea | null;
    user: ReviewUser | null;
    approver: ReviewUser | null;
};

type Stats = {
    total: number;
    approved: number;
    hidden: number;
    average: number;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    tab: string;
    areas: Area[];
    allAreas: Area[];
    reviews: {
        data: Review[];
        current_page: number;
        last_page: number;
        total: number;
        links: PaginationLink[];
    };
    stats: Stats;
    filters: {
        search?: string;
        area_id?: string;
        sub_area_id?: string;
        rating?: string;
        status?: string;
        period?: string;
    };
    subAreasOptions: SubArea[];
};

type FlashProps = {
    success?: string;
};

const statusConfig: Record<string, { label: string; className: string }> = {
    approved: { label: 'Disetujui', className: 'bg-green-100 text-green-800' },
    hidden: { label: 'Disembunyikan', className: 'bg-gray-100 text-gray-600' },
};

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`h-4 w-4 ${
                        star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-200'
                    }`}
                />
            ))}
        </div>
    );
}

export default function AdminReviewIndex({
    tab: initialTab,
    areas,
    allAreas,
    reviews,
    stats,
    filters,
    subAreasOptions,
}: Props) {
    const { success } = usePage().props as unknown as FlashProps;
    const [tab, setTab] = useState(initialTab);
    const [showSuccess, setShowSuccess] = useState(false);

    const [search, setSearch] = useState(filters.search || '');
    const [filterAreaId, setFilterAreaId] = useState(filters.area_id || '');
    const [filterSubAreaId, setFilterSubAreaId] = useState(filters.sub_area_id || '');
    const [filterRating, setFilterRating] = useState(filters.rating || '');
    const [filterPeriod, setFilterPeriod] = useState(filters.period || '');

    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [detailReview, setDetailReview] = useState<Review | null>(null);

    const [confirm, setConfirm] = useState<{
        open: boolean; title: string; message: string; action: () => void;
    }>({ open: false, title: '', message: '', action: () => {} });

    const [areaModalOpen, setAreaModalOpen] = useState(false);
    const [editingArea, setEditingArea] = useState<Area | null>(null);
    const [areaForm, setAreaForm] = useState({ name: '', description: '', sort_order: '0', is_active: true });
    const [areaErrors, setAreaErrors] = useState<Record<string, string>>({});

    const [subAreaModalOpen, setSubAreaModalOpen] = useState(false);
    const [editingSubArea, setEditingSubArea] = useState<SubArea | null>(null);
    const [subAreaForm, setSubAreaForm] = useState({ area_id: '', name: '', description: '', sort_order: '0', is_active: true });
    const [subAreaErrors, setSubAreaErrors] = useState<Record<string, string>>({});

    const [expandedAreas, setExpandedAreas] = useState<Set<number>>(new Set());

    const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 3500);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const switchTab = (newTab: string) => {
        setTab(newTab);
        const params: Record<string, string> = { tab: newTab };
        if (newTab === 'reviews') {
            if (search) params.search = search;
            if (filterAreaId) params.area_id = filterAreaId;
            if (filterSubAreaId) params.sub_area_id = filterSubAreaId;
            if (filterRating) params.rating = filterRating;
            if (filterPeriod) params.period = filterPeriod;
        }
        router.get('/admin/review', params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const applyFilters = useCallback((overrides: Record<string, string | undefined> = {}) => {
        const s = overrides.search !== undefined ? overrides.search : search;
        const a = overrides.area_id !== undefined ? overrides.area_id : filterAreaId;
        const sa = overrides.sub_area_id !== undefined ? overrides.sub_area_id : filterSubAreaId;
        const r = overrides.rating !== undefined ? overrides.rating : filterRating;
        const p = overrides.period !== undefined ? overrides.period : filterPeriod;

        const params: Record<string, string> = { tab: 'reviews' };
        if (s) params.search = s;
        if (a) params.area_id = a;
        if (sa) params.sub_area_id = sa;
        if (r) params.rating = r;
        if (p) params.period = p;

        router.get('/admin/review', params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }, [search, filterAreaId, filterSubAreaId, filterRating, filterPeriod]);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        if (searchDebounce.current) clearTimeout(searchDebounce.current);
        searchDebounce.current = setTimeout(() => {
            applyFilters({ search: value || undefined, area_id: undefined, sub_area_id: undefined, rating: undefined, period: undefined });
        }, 400);
    };

    const handleAreaFilterChange = (value: string) => {
        setFilterAreaId(value);
        setFilterSubAreaId('');
        applyFilters({ area_id: value || undefined, sub_area_id: undefined });
    };

    const handleSubAreaFilterChange = (value: string) => {
        setFilterSubAreaId(value);
        applyFilters({ sub_area_id: value || undefined });
    };

    const handleRatingFilterChange = (value: string) => {
        setFilterRating(value);
        applyFilters({ rating: value || undefined });
    };

    const handlePeriodFilterChange = (value: string) => {
        setFilterPeriod(value);
        applyFilters({ period: value || undefined });
    };

    const resetFilters = () => {
        setSearch('');
        setFilterAreaId('');
        setFilterSubAreaId('');
        setFilterRating('');
        setFilterPeriod('');
        router.get('/admin/review', { tab: 'reviews' }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleHide = (id: number) => {
        setConfirm({
            open: true,
            title: 'Sembunyikan Review',
            message: 'Apakah Anda yakin ingin menyembunyikan review ini?',
            action: () => {
                router.patch(`/admin/review/${id}/hide`, {}, {
                    preserveScroll: true,
                    onSuccess: () => router.reload({ only: ['reviews', 'stats'] }),
                });
            },
        });
    };

    const handleRestore = (id: number) => {
        setConfirm({
            open: true,
            title: 'Tampilkan Kembali Review',
            message: 'Apakah Anda yakin ingin menampilkan kembali review ini?',
            action: () => {
                router.patch(`/admin/review/${id}/restore`, {}, {
                    preserveScroll: true,
                    onSuccess: () => router.reload({ only: ['reviews', 'stats'] }),
                });
            },
        });
    };

    const handleDelete = (id: number) => {
        setConfirm({
            open: true,
            title: 'Hapus Review',
            message: 'Apakah Anda yakin ingin menghapus review ini? Tindakan ini tidak dapat dibatalkan.',
            action: () => {
                router.delete(`/admin/review/${id}`, {
                    preserveScroll: true,
                    onSuccess: () => router.reload({ only: ['reviews', 'stats'] }),
                });
            },
        });
    };

    const openDetail = async (id: number) => {
        try {
            const res = await fetch(`/admin/review/${id}`, {
                headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            });
            const data = await res.json();
            setDetailReview(data.review);
            setDetailModalOpen(true);
        } catch {
            // fallback
        }
    };

    const openAddArea = () => {
        setEditingArea(null);
        setAreaForm({ name: '', description: '', sort_order: '0', is_active: true });
        setAreaErrors({});
        setAreaModalOpen(true);
    };

    const openEditArea = (area: Area) => {
        setEditingArea(area);
        setAreaForm({
            name: area.name,
            description: area.description ?? '',
            sort_order: String(area.sort_order),
            is_active: area.is_active,
        });
        setAreaErrors({});
        setAreaModalOpen(true);
    };

    const saveArea = () => {
        if (editingArea) {
            router.put(`/admin/review/areas/${editingArea.id}`, areaForm, {
                preserveScroll: true,
                onError: (err) => setAreaErrors(err as Record<string, string>),
                onSuccess: () => {
                    setAreaModalOpen(false);
                    router.reload({ only: ['areas', 'allAreas'] });
                },
            });
        } else {
            router.post('/admin/review/areas', areaForm, {
                preserveScroll: true,
                onError: (err) => setAreaErrors(err as Record<string, string>),
                onSuccess: () => {
                    setAreaModalOpen(false);
                    router.reload({ only: ['areas', 'allAreas'] });
                },
            });
        }
    };

    const deleteArea = (area: Area) => {
        setConfirm({
            open: true,
            title: 'Hapus Area',
            message: `Apakah Anda yakin ingin menghapus area "${area.name}"? Seluruh bagian dan review di dalamnya akan ikut terhapus. Tindakan ini tidak dapat dibatalkan.`,
            action: () => {
                router.delete(`/admin/review/areas/${area.id}`, {
                    preserveScroll: true,
                    onSuccess: () => router.reload({ only: ['areas', 'allAreas'] }),
                });
            },
        });
    };

    const openAddSubArea = (areaId?: number) => {
        setEditingSubArea(null);
        setSubAreaForm({
            area_id: areaId ? String(areaId) : '',
            name: '',
            description: '',
            sort_order: '0',
            is_active: true,
        });
        setSubAreaErrors({});
        setSubAreaModalOpen(true);
    };

    const openEditSubArea = (subArea: SubArea) => {
        setEditingSubArea(subArea);
        setSubAreaForm({
            area_id: String(subArea.area_id),
            name: subArea.name,
            description: subArea.description ?? '',
            sort_order: String(subArea.sort_order),
            is_active: subArea.is_active,
        });
        setSubAreaErrors({});
        setSubAreaModalOpen(true);
    };

    const saveSubArea = () => {
        if (editingSubArea) {
            router.put(`/admin/review/sub-areas/${editingSubArea.id}`, subAreaForm, {
                preserveScroll: true,
                onError: (err) => setSubAreaErrors(err as Record<string, string>),
                onSuccess: () => {
                    setSubAreaModalOpen(false);
                    router.reload({ only: ['areas', 'allAreas'] });
                },
            });
        } else {
            router.post('/admin/review/sub-areas', subAreaForm, {
                preserveScroll: true,
                onError: (err) => setSubAreaErrors(err as Record<string, string>),
                onSuccess: () => {
                    setSubAreaModalOpen(false);
                    router.reload({ only: ['areas', 'allAreas'] });
                },
            });
        }
    };

    const deleteSubArea = (subArea: SubArea) => {
        setConfirm({
            open: true,
            title: 'Hapus Bagian',
            message: `Apakah Anda yakin ingin menghapus bagian "${subArea.name}"? Seluruh review di dalamnya akan ikut terhapus. Tindakan ini tidak dapat dibatalkan.`,
            action: () => {
                router.delete(`/admin/review/sub-areas/${subArea.id}`, {
                    preserveScroll: true,
                    onSuccess: () => router.reload({ only: ['areas', 'allAreas'] }),
                });
            },
        });
    };

    const toggleExpandArea = (areaId: number) => {
        setExpandedAreas((prev) => {
            const next = new Set(prev);
            if (next.has(areaId)) next.delete(areaId);
            else next.add(areaId);
            return next;
        });
    };

    const renderActions = (review: Review) => {
        const actions: React.ReactNode[] = [];

        actions.push(
            <Button key="detail" variant="outline" size="sm" onClick={() => openDetail(review.id)} className="border-green-200 text-green-700 hover:bg-green-50">
                <Eye className="h-3.5 w-3.5" /> Detail
            </Button>
        );

        switch (review.status) {
            case 'approved':
                actions.push(
                    <Button key="hide" variant="outline" size="sm" onClick={() => handleHide(review.id)} className="border-amber-200 text-amber-700 hover:bg-amber-50">
                        <EyeOff className="h-3.5 w-3.5" /> Sembunyikan
                    </Button>
                );
                actions.push(
                    <Button key="delete" variant="destructive" size="sm" onClick={() => handleDelete(review.id)}>
                        <Trash2 className="h-3.5 w-3.5" /> Hapus
                    </Button>
                );
                break;
            case 'hidden':
                actions.push(
                    <Button key="restore" variant="outline" size="sm" onClick={() => handleRestore(review.id)} className="border-blue-200 text-blue-700 hover:bg-blue-50">
                        <Undo2 className="h-3.5 w-3.5" /> Tampilkan
                    </Button>
                );
                actions.push(
                    <Button key="delete" variant="destructive" size="sm" onClick={() => handleDelete(review.id)}>
                        <Trash2 className="h-3.5 w-3.5" /> Hapus
                    </Button>
                );
                break;
        }

        return <div className="flex flex-wrap gap-1.5 justify-end">{actions}</div>;
    };

    const subAreaOptionsForFilter = filterAreaId
        ? subAreasOptions
        : [];

    return (
        <>
            <Head title="Kelola Review" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Heading
                    title="Kelola Review"
                    description="Kelola penilaian, komentar, area, dan bagian yang ditampilkan pada halaman Review ZeroLib."
                />

                {showSuccess && success && (
                    <div className="flex items-center gap-3 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800 shadow-sm">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                        <span className="flex-1">{success}</span>
                    </div>
                )}

                <div className="flex items-center gap-1 border-b pb-0">
                    <button
                        onClick={() => switchTab('reviews')}
                        className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                            tab === 'reviews'
                                ? 'border-green-600 text-green-700'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Daftar Review
                    </button>
                    <button
                        onClick={() => switchTab('areas')}
                        className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                            tab === 'areas'
                                ? 'border-green-600 text-green-700'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Area & Bagian
                    </button>
                </div>

                {tab === 'reviews' && (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <div className="rounded-xl border bg-white p-4 shadow-sm">
                                <div className="text-xs font-medium text-gray-500">Total Review</div>
                                <div className="mt-1 text-2xl font-bold text-gray-900">{stats.total}</div>
                            </div>
                            <div className="rounded-xl border bg-gray-50 p-4 shadow-sm">
                                <div className="text-xs font-medium text-gray-500">Disembunyikan</div>
                                <div className="mt-1 text-2xl font-bold text-gray-700">{stats.hidden}</div>
                            </div>
                            <div className="rounded-xl border bg-white p-4 shadow-sm">
                                <div className="text-xs font-medium text-gray-500">Rata-rata Rating</div>
                                <div className="mt-1 text-2xl font-bold text-gray-900 flex items-center gap-1">
                                    {stats.average} <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-400" />
                                <Input
                                    placeholder="Cari..."
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="border-green-200 pl-9 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                                />
                            </div>
                            <Select value={filterAreaId} onValueChange={handleAreaFilterChange}>
                                <SelectTrigger className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20">
                                    <SelectValue placeholder="Semua Area" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all_placeholder">Semua Area</SelectItem>
                                    {allAreas.map((a) => (
                                        <SelectItem key={a.id} value={String(a.id)}>{a.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={filterSubAreaId} onValueChange={handleSubAreaFilterChange} disabled={!filterAreaId}>
                                <SelectTrigger className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20">
                                    <SelectValue placeholder="Semua Bagian" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all_placeholder">Semua Bagian</SelectItem>
                                    {subAreaOptionsForFilter.map((sa) => (
                                        <SelectItem key={sa.id} value={String(sa.id)}>{sa.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={filterRating} onValueChange={handleRatingFilterChange}>
                                <SelectTrigger className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20">
                                    <SelectValue placeholder="Semua Rating" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all_placeholder">Semua Rating</SelectItem>
                                    <SelectItem value="5">5 Bintang</SelectItem>
                                    <SelectItem value="4">4 Bintang</SelectItem>
                                    <SelectItem value="3">3 Bintang</SelectItem>
                                    <SelectItem value="2">2 Bintang</SelectItem>
                                    <SelectItem value="1">1 Bintang</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={filterPeriod} onValueChange={handlePeriodFilterChange}>
                                <SelectTrigger className="border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20">
                                    <SelectValue placeholder="Semua Waktu" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all_placeholder">Semua Waktu</SelectItem>
                                    <SelectItem value="today">Hari Ini</SelectItem>
                                    <SelectItem value="week">7 Hari Terakhir</SelectItem>
                                    <SelectItem value="month">30 Hari Terakhir</SelectItem>
                                    <SelectItem value="this_month">Bulan Ini</SelectItem>
                                    <SelectItem value="this_year">Tahun Ini</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={resetFilters} className="border-green-200 text-green-700 hover:bg-green-50">
                                Reset Filter
                            </Button>
                            <span className="text-sm text-gray-500">{reviews.total} hasil ditemukan</span>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-green-200 bg-white shadow-sm">
                            <Table className="min-w-[1000px]">
                                <TableHeader>
                                    <TableRow className="border-green-100 bg-green-50/50">
                                        <TableHead className="text-green-700 w-12">No</TableHead>
                                        <TableHead className="text-green-700">Tanggal</TableHead>
                                        <TableHead className="text-green-700">Pengguna</TableHead>
                                        <TableHead className="text-green-700">Area</TableHead>
                                        <TableHead className="text-green-700">Bagian</TableHead>
                                        <TableHead className="text-green-700">Rating</TableHead>
                                        <TableHead className="text-green-700">Komentar</TableHead>
                                        <TableHead className="text-green-700">Status</TableHead>
                                        <TableHead className="text-right text-green-700">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reviews.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={9} className="text-center text-green-600/70 py-8">
                                                Tidak ada review yang ditemukan.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        reviews.data.map((review, i) => {
                                            const st = statusConfig[review.status] ?? { label: review.status, className: 'bg-gray-100 text-gray-600' };
                                            return (
                                                <TableRow key={review.id} className="border-green-100">
                                                    <TableCell>{(reviews.current_page - 1) * 10 + i + 1}</TableCell>
                                                    <TableCell className="text-sm whitespace-nowrap">
                                                        {new Date(review.created_at).toLocaleDateString('id-ID', {
                                                            day: 'numeric', month: 'short', year: 'numeric',
                                                        })}
                                                    </TableCell>
                                                    <TableCell className="text-sm font-medium">
                                                        Anonim
                                                    </TableCell>
                                                    <TableCell className="text-sm">{review.area?.name ?? '-'}</TableCell>
                                                    <TableCell className="text-sm">{review.sub_area?.name ?? '-'}</TableCell>
                                                    <TableCell><StarRating rating={review.rating} /></TableCell>
                                                    <TableCell className="text-sm max-w-[200px] truncate">
                                                        {review.comment}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${st.className}`}>
                                                            {st.label}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {renderActions(review)}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {reviews.links && reviews.links.length > 3 && (
                            <div className="flex items-center justify-center gap-1">
                                {reviews.links.map((link, i) => {
                                    if (link.label.includes('Previous') || link.label.includes('Next')) {
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
                                                disabled={!link.url}
                                                className="px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-50 text-gray-600"
                                            >
                                                {link.label.includes('Previous') ? 'Sebelumnya' : 'Berikutnya'}
                                            </button>
                                        );
                                    }
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
                                            disabled={!link.url || link.active}
                                            className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors ${
                                                link.active ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-green-50'
                                            }`}
                                        >
                                            {link.label.replace(/&laquo;|&raquo;/g, '')}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}

                {tab === 'areas' && (
                    <>
                        <div className="flex justify-end">
                            <Button onClick={openAddArea} className="bg-green-600 hover:bg-green-700 text-white">
                                <Plus className="h-4 w-4 mr-1" /> Tambah Area
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {areas.map((area) => {
                                const expanded = expandedAreas.has(area.id);
                                return (
                                    <div key={area.id} className="rounded-xl border bg-white shadow-sm">
                                        <div className="p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <button
                                                            onClick={() => toggleExpandArea(area.id)}
                                                            className="text-sm hover:bg-gray-100 rounded p-0.5"
                                                        >
                                                            {expanded ? (
                                                                <ChevronDown className="h-4 w-4 text-gray-500" />
                                                            ) : (
                                                                <ChevronRight className="h-4 w-4 text-gray-500" />
                                                            )}
                                                        </button>
                                                        <h3 className="font-semibold text-gray-900">{area.name}</h3>
                                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                                            area.is_active
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-gray-100 text-gray-500'
                                                        }`}>
                                                            {area.is_active ? 'Aktif' : 'Nonaktif'}
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            {area.sub_areas.length} Bagian
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            {area.area_reviews_count} Review
                                                        </span>
                                                    </div>
                                                    {area.description && (
                                                        <p className="mt-1 text-sm text-gray-500">{area.description}</p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openAddSubArea(area.id)}
                                                        className="border-green-200 text-green-700 hover:bg-green-50"
                                                    >
                                                        <Plus className="h-3.5 w-3.5" /> Bagian
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openEditArea(area)}
                                                        className="border-blue-200 text-blue-700 hover:bg-blue-50"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => deleteArea(area)}
                                                        className="border-red-200 text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {expanded && area.sub_areas.length > 0 && (
                                            <div className="border-t px-4 py-3 space-y-2 bg-gray-50/50">
                                                {area.sub_areas.map((sa) => (
                                                    <div key={sa.id} className="flex items-center justify-between gap-2 pl-6">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium text-gray-700">
                                                                {sa.name}
                                                            </span>
                                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                                                                sa.is_active
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-gray-100 text-gray-500'
                                                            }`}>
                                                                {sa.is_active ? 'Aktif' : 'Nonaktif'}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => openEditSubArea(sa)}
                                                                className="text-blue-600 hover:bg-blue-50"
                                                            >
                                                                <Pencil className="h-3.5 w-3.5" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => deleteSubArea(sa)}
                                                                className="text-red-500 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {areas.length === 0 && (
                                <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
                                    Belum ada area.
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Detail Modal */}
            <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Detail Review</DialogTitle>
                    </DialogHeader>
                    {detailReview && (
                        <div className="space-y-3 text-sm">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <span className="text-gray-500">Pengguna:</span>
                                    <span className="ml-1 font-medium">Anonim</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Status:</span>
                                    <span className={`ml-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                        statusConfig[detailReview.status]?.className ?? ''
                                    }`}>
                                        {statusConfig[detailReview.status]?.label ?? detailReview.status}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Area:</span>
                                    <span className="ml-1 font-medium">{detailReview.area?.name ?? '-'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Bagian:</span>
                                    <span className="ml-1 font-medium">{detailReview.sub_area?.name ?? '-'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Rating:</span>
                                    <span className="ml-1"><StarRating rating={detailReview.rating} /></span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Tanggal:</span>
                                    <span className="ml-1 font-medium">
                                        {new Date(detailReview.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                                {detailReview.approved_at && (
                                    <>
                                        <div>
                                            <span className="text-gray-500">Disetujui pada:</span>
                                            <span className="ml-1 font-medium">
                                                {new Date(detailReview.approved_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric', month: 'long', year: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Disetujui oleh:</span>
                                            <span className="ml-1 font-medium">{detailReview.approver?.name ?? '-'}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div>
                                <span className="text-gray-500">Komentar:</span>
                                <p className="mt-1 p-3 rounded-lg bg-gray-50 text-gray-800 whitespace-pre-wrap">
                                    {detailReview.comment}
                                </p>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDetailModalOpen(false)}>Tutup</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirm Dialog */}
            <Dialog open={confirm.open} onOpenChange={(open) => setConfirm((c) => ({ ...c, open }))}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>{confirm.title}</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-gray-600">{confirm.message}</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirm((c) => ({ ...c, open: false }))}>
                            Batal
                        </Button>
                        <Button className="bg-red-600 text-white hover:bg-red-700" onClick={() => {
                            confirm.action();
                            setConfirm((c) => ({ ...c, open: false }));
                        }}>
                            Ya, Lanjutkan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Area Modal */}
            <Dialog open={areaModalOpen} onOpenChange={setAreaModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingArea ? 'Edit Area' : 'Tambah Area'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        <div>
                            <Label>Nama Area *</Label>
                            <Input
                                value={areaForm.name}
                                onChange={(e) => setAreaForm((f) => ({ ...f, name: e.target.value }))}
                                placeholder="Masukkan nama area"
                                className="mt-1"
                                maxLength={100}
                            />
                            {areaErrors.name && <p className="mt-1 text-sm text-red-500">{areaErrors.name}</p>}
                        </div>
                        <div>
                            <Label>Deskripsi</Label>
                            <Textarea
                                value={areaForm.description}
                                onChange={(e) => setAreaForm((f) => ({ ...f, description: e.target.value }))}
                                placeholder="Deskripsi area (opsional)"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Urutan</Label>
                            <Input
                                type="number"
                                value={areaForm.sort_order}
                                onChange={(e) => setAreaForm((f) => ({ ...f, sort_order: e.target.value }))}
                                className="mt-1"
                                min={0}
                            />
                            {areaErrors.sort_order && <p className="mt-1 text-sm text-red-500">{areaErrors.sort_order}</p>}
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={areaForm.is_active}
                                onChange={(e) => setAreaForm((f) => ({ ...f, is_active: e.target.checked }))}
                                id="area-active"
                                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <Label htmlFor="area-active">Status Aktif</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAreaModalOpen(false)}>Batal</Button>
                        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={saveArea}>
                            Simpan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Sub-Area Modal */}
            <Dialog open={subAreaModalOpen} onOpenChange={setSubAreaModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingSubArea ? 'Edit Bagian' : 'Tambah Bagian'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        <div>
                            <Label>Area *</Label>
                            <Select
                                value={subAreaForm.area_id}
                                onValueChange={(v) => setSubAreaForm((f) => ({ ...f, area_id: v }))}
                                disabled={!!editingSubArea || subAreaForm.area_id !== ''}
                            >
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Pilih Area" />
                                </SelectTrigger>
                                <SelectContent>
                                    {areas.map((a) => (
                                        <SelectItem key={a.id} value={String(a.id)}>{a.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {subAreaErrors.area_id && <p className="mt-1 text-sm text-red-500">{subAreaErrors.area_id}</p>}
                        </div>
                        <div>
                            <Label>Nama Bagian *</Label>
                            <Input
                                value={subAreaForm.name}
                                onChange={(e) => setSubAreaForm((f) => ({ ...f, name: e.target.value }))}
                                placeholder="Masukkan nama bagian"
                                className="mt-1"
                                maxLength={100}
                            />
                            {subAreaErrors.name && <p className="mt-1 text-sm text-red-500">{subAreaErrors.name}</p>}
                        </div>
                        <div>
                            <Label>Deskripsi</Label>
                            <Textarea
                                value={subAreaForm.description}
                                onChange={(e) => setSubAreaForm((f) => ({ ...f, description: e.target.value }))}
                                placeholder="Deskripsi bagian (opsional)"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Urutan</Label>
                            <Input
                                type="number"
                                value={subAreaForm.sort_order}
                                onChange={(e) => setSubAreaForm((f) => ({ ...f, sort_order: e.target.value }))}
                                className="mt-1"
                                min={0}
                            />
                            {subAreaErrors.sort_order && <p className="mt-1 text-sm text-red-500">{subAreaErrors.sort_order}</p>}
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={subAreaForm.is_active}
                                onChange={(e) => setSubAreaForm((f) => ({ ...f, is_active: e.target.checked }))}
                                id="sub-area-active"
                                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <Label htmlFor="sub-area-active">Status Aktif</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSubAreaModalOpen(false)}>Batal</Button>
                        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={saveSubArea}>
                            Simpan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
