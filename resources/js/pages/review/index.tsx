import { Head, router, usePage } from '@inertiajs/react';
import { Star, Send, Filter } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { C, display, body } from '@/theme';

type SubArea = {
    id: number;
    area_id: number;
    name: string;
    is_active: boolean;
};

type Area = {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    sub_areas: SubArea[];
};

type ReviewUser = {
    id: number;
    name: string;
};

type Review = {
    id: number;
    area_id: number;
    sub_area_id: number | null;
    rating: number;
    comment: string;
    status: string;
    created_at: string;
    area: Area | null;
    sub_area: SubArea | null;
    user: ReviewUser | null;
};

type RatingDistribution = {
    [key: number]: { count: number; percentage: number };
};

type Props = {
    areas: Area[];
    reviews: {
        data: Review[];
        current_page: number;
        last_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        area_id: number | null;
        sub_area_id: number | null;
        rating: number | null;
    };
    subAreasOptions: SubArea[];
    stats: {
        total: number;
        average: number;
        distribution: RatingDistribution;
    };
};

type FlashProps = {
    success?: string;
};

function StarRating({ rating, onChange, interactive = true, size = 'md' }: {
    rating: number;
    onChange?: (r: number) => void;
    interactive?: boolean;
    size?: 'sm' | 'md' | 'lg';
}) {
    const sizeClass = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-8 w-8' : 'h-6 w-6';

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => interactive && onChange?.(star)}
                    className={`${interactive ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'}`}
                    disabled={!interactive}
                    tabIndex={-1}
                >
                    <Star
                        className={`${sizeClass} transition-colors ${
                            star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                        }`}
                    />
                </button>
            ))}
        </div>
    );
}

function RatingBar({ star, count, percentage }: { star: number; count: number; percentage: number }) {
    return (
        <div className="flex items-center gap-2">
            <span className="w-16 text-sm font-medium text-gray-600 flex items-center gap-1">
                {star} <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            </span>
            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: C.leaf500,
                    }}
                />
            </div>
            <span className="w-12 text-right text-sm text-gray-500">{count}</span>
        </div>
    );
}

export default function ReviewIndex({ areas, reviews, filters, subAreasOptions, stats }: Props) {
    const { success } = usePage().props as unknown as FlashProps;
    const [filterArea, setFilterArea] = useState(filters.area_id ? String(filters.area_id) : '');
    const [filterSubArea, setFilterSubArea] = useState(filters.sub_area_id ? String(filters.sub_area_id) : '');
    const [filterRating, setFilterRating] = useState(filters.rating ? String(filters.rating) : '');

    const [formArea, setFormArea] = useState('');
    const [formSubArea, setFormSubArea] = useState('');
    const [formRating, setFormRating] = useState(0);
    const [formComment, setFormComment] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const currentArea = areas.find((a) => a.id === parseInt(formArea));
    const subAreas = currentArea?.sub_areas ?? [];

    const isReviewFormValid =
        Boolean(formArea) &&
        Number(formRating) >= 1 &&
        Number(formRating) <= 5;

    const isSubmitDisabled = !isReviewFormValid || processing;

    useEffect(() => {
        if (success) {
            setShowSuccess(true);
            setFormArea('');
            setFormSubArea('');
            setFormRating(0);
            setFormComment('');
            setErrors({});
            const timer = setTimeout(() => setShowSuccess(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleAreaChange = (value: string) => {
        setFormArea(value);
        setFormSubArea('');
        setFilterArea(value);
        setFilterSubArea('');
        applyFilters(value, '', filterRating);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitDisabled) return;
        setErrors({});
        setProcessing(true);

        router.post('/review', {
            area_id: formArea ? parseInt(formArea) : undefined,
            sub_area_id: (formSubArea && formSubArea !== '__overall') ? parseInt(formSubArea) : undefined,
            rating: formRating,
            comment: formComment,
        }, {
            onError: (err) => {
                setErrors(err as Record<string, string>);
                setProcessing(false);
            },
            onSuccess: () => setProcessing(false),
            preserveScroll: true,
        });
    };

    const applyFilters = useCallback((area: string, subArea: string, rating: string) => {
        const params: Record<string, string> = {};
        if (area) params.area_id = area;
        if (subArea) params.sub_area_id = subArea;
        if (rating) params.rating = rating;

        router.get('/review', params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }, []);

    const handleFilterAreaChange = (value: string) => {
        setFilterArea(value);
        setFilterSubArea('');
        applyFilters(value, '', filterRating);
    };

    const handleFilterSubAreaChange = (value: string) => {
        setFilterSubArea(value);
        applyFilters(filterArea, value, filterRating);
    };

    const handleFilterRatingChange = (value: string) => {
        setFilterRating(value);
        applyFilters(filterArea, filterSubArea, value);
    };

    const filterSubAreas = filterArea ? subAreasOptions : [];

    return (
        <div style={{ ...body, backgroundColor: C.paper50, minHeight: '100vh', color: C.ink900 }}>
            <Head title="Review Area ZeroLib" />
            <Navbar activeSection="review" />

            <main className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: C.ink900 }}>
                        Review Area ZeroLib
                    </h1>
                    <p className="mt-3 text-lg" style={{ color: C.ink500 }}>
                        Bagikan pengalaman Anda saat menggunakan fasilitas dan area ZeroLib.
                    </p>
                </div>

                {showSuccess && (
                    <div className="flex items-center gap-3 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm font-medium text-green-800 shadow-sm mb-6 transition-opacity duration-300">
                        <Send className="h-5 w-5 shrink-0 text-green-600" />
                        <span className="flex-1">{success}</span>
                    </div>
                )}
{/* FORM */}
                <div className="rounded-xl border bg-white p-5 shadow-sm mb-8">
                    <h2 className="text-lg font-semibold mb-4" style={{ color: C.ink900 }}>
                        <Send className="h-4 w-4 inline mr-1.5" />
                        Tulis Review
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <Label className="font-medium" style={{ color: C.ink900 }}>Area *</Label>
                                <Select value={formArea} onValueChange={handleAreaChange}>
                                    <SelectTrigger className="mt-1 w-full border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20">
                                        <SelectValue placeholder="Pilih Area" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {areas.map((area) => (
                                            <SelectItem key={area.id} value={String(area.id)}>{area.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.area_id && <p className="mt-1 text-sm text-red-500">{errors.area_id}</p>}
                            </div>
                            <div>
                                <Label className="font-medium" style={{ color: C.ink900 }}>
                                    Bagian
                                </Label>
                                <Select
                                    value={formSubArea}
                                    onValueChange={setFormSubArea}
                                    disabled={!formArea}
                                >
                                    <SelectTrigger className="mt-1 w-full border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20">
                                        <SelectValue placeholder={!formArea ? 'Pilih Area Terlebih Dahulu' : 'Pilih Bagian'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__overall">Keseluruhan {currentArea?.name ?? 'Area'}</SelectItem>
                                        {subAreas.map((sa) => (
                                            <SelectItem key={sa.id} value={String(sa.id)}>{sa.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.sub_area_id && <p className="mt-1 text-sm text-red-500">{errors.sub_area_id}</p>}
                            </div>
                        </div>

                        <div>
                            <Label className="font-medium" style={{ color: C.ink900 }}>Rating *</Label>
                            <div className="mt-1">
                                <StarRating rating={formRating} onChange={setFormRating} size="lg" />
                            </div>
                            {errors.rating && <p className="mt-1 text-sm text-red-500">{errors.rating}</p>}
                        </div>

                        <div>
                            <Label className="font-medium" style={{ color: C.ink900 }}>Komentar</Label>
                            <Textarea
                                value={formComment}
                                onChange={(e) => setFormComment(e.target.value)}
                                placeholder="Ceritakan pengalaman Anda (opsional)..."
                                className="mt-1 min-h-[100px] border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                                maxLength={1000}
                            />
                            <div className="flex justify-between mt-1">
                                {errors.comment && <p className="text-sm text-red-500">{errors.comment}</p>}
                                <span className="text-xs ml-auto" style={{ color: C.ink500 }}>{formComment.length}/1000</span>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitDisabled}
                            className="w-full sm:w-auto px-8 py-2.5 text-base font-semibold"
                            style={{
                                backgroundColor: C.leaf500,
                                color: '#fff',
                            }}
                        >
                            <Send className="h-4 w-4 mr-2" />
                            Kirim Review
                        </Button>
                    </form>
                </div>
{/* FILTER */}
                <div className="rounded-xl border bg-white p-5 shadow-sm mb-8">
                    <h2 className="text-lg font-semibold mb-4" style={{ color: C.ink900 }}>
                        <Filter className="h-4 w-4 inline mr-1.5" />
                        Filter Review
                    </h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <Label className="mb-1.5 block text-sm font-medium" style={{ color: C.ink500 }}>Area</Label>
                            <Select value={filterArea} onValueChange={handleFilterAreaChange}>
                                <SelectTrigger className="w-full border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20">
                                    <SelectValue placeholder="Semua Area" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all_placeholder">Semua Area</SelectItem>
                                    {areas.map((area) => (
                                        <SelectItem key={area.id} value={String(area.id)}>{area.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="mb-1.5 block text-sm font-medium" style={{ color: C.ink500 }}>Bagian</Label>
                            <Select
                                value={filterSubArea}
                                onValueChange={handleFilterSubAreaChange}
                                disabled={!filterArea || filterSubAreas.length === 0}
                            >
                                <SelectTrigger className="w-full border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20">
                                    <SelectValue placeholder="Keseluruhan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all_placeholder">Keseluruhan</SelectItem>
                                    {filterSubAreas.map((sa) => (
                                        <SelectItem key={sa.id} value={String(sa.id)}>{sa.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="mb-1.5 block text-sm font-medium" style={{ color: C.ink500 }}>Rating</Label>
                            <Select value={filterRating} onValueChange={handleFilterRatingChange}>
                                <SelectTrigger className="w-full border-green-200 focus-visible:border-green-500 focus-visible:ring-green-500/20">
                                    <SelectValue placeholder="Semua Bintang" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all_placeholder">Semua Bintang</SelectItem>
                                    <SelectItem value="5">5 Bintang</SelectItem>
                                    <SelectItem value="4">4 Bintang</SelectItem>
                                    <SelectItem value="3">3 Bintang</SelectItem>
                                    <SelectItem value="2">2 Bintang</SelectItem>
                                    <SelectItem value="1">1 Bintang</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
{/* RINGKASAN */}
                <div className="rounded-xl border bg-white p-5 shadow-sm mb-8">
                    <h2 className="text-lg font-semibold mb-4" style={{ color: C.ink900 }}>Ringkasan Rating</h2>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="text-center">
                            <div className="text-4xl font-bold" style={{ color: C.leaf500 }}>
                                {stats.average}
                            </div>
                            <StarRating rating={Math.round(stats.average)} interactive={false} size="sm" />
                            <div className="text-sm mt-1" style={{ color: C.ink500 }}>
                                {stats.total} review
                            </div>
                        </div>
                        <div className="flex-1 w-full space-y-1.5">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const d = stats.distribution[star];
                                return (
                                    <RatingBar
                                        key={star}
                                        star={star}
                                        count={d?.count ?? 0}
                                        percentage={d?.percentage ?? 0}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>

                {reviews.data.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold" style={{ color: C.ink900 }}>
                            {reviews.total} Review
                        </h2>

                        {reviews.data.map((review) => (
                            <div key={review.id} className="rounded-xl border bg-white p-5 shadow-sm">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-semibold" style={{ color: C.ink900 }}>
                                                Anonim
                                            </span>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100" style={{ color: C.leaf500 }}>
                                                {review.area?.name}
                                            </span>
                                            {review.sub_area && (
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                                                    {review.sub_area.name}
                                                </span>
                                            )}
                                        </div>
                                        <StarRating rating={review.rating} interactive={false} size="sm" />
                                    </div>
                                    <span className="text-xs shrink-0" style={{ color: C.ink500 }}>
                                        {new Date(review.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric', month: 'long', year: 'numeric',
                                        })}
                                    </span>
                                </div>
                                {review.comment && (
                                    <p className="mt-3 text-sm leading-relaxed" style={{ color: C.ink900 }}>
                                        {review.comment}
                                    </p>
                                )}
                            </div>
                        ))}

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
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
