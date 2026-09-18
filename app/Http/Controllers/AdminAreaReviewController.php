<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\AreaReview;
use App\Models\SubArea;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminAreaReviewController extends Controller
{
    public function index(Request $request): Response
    {
        $tab = $request->query('tab', 'reviews');
        if (!in_array($tab, ['reviews', 'areas'], true)) {
            $tab = 'reviews';
        }

        $areas = Area::with(['subAreas' => fn ($q) => $q->orderBy('sort_order')])
            ->withCount('areaReviews')
            ->orderBy('sort_order')
            ->get();

        $allAreas = Area::where('is_active', true)->orderBy('sort_order')->get();

        $reviews = AreaReview::query()->whereRaw('1 = 0')->paginate(10);
        $stats = [
            'total' => 0,
            'approved' => 0,
            'hidden' => 0,
            'average' => 0,
        ];

        if ($tab === 'reviews') {
            $reviews = AreaReview::query()
                ->with(['area', 'subArea', 'user', 'approver'])
                ->when($request->filled('search'), function ($query) use ($request) {
                    $search = trim($request->search);
                    $query->where(function ($subQuery) use ($search) {
                        $subQuery
                            ->where('comment', 'like', "%{$search}%")
                            ->orWhereHas('area', fn ($areaQuery) =>
                                $areaQuery->where('name', 'like', "%{$search}%")
                            )
                            ->orWhereHas('subArea', fn ($subAreaQuery) =>
                                $subAreaQuery->where('name', 'like', "%{$search}%")
                            )
                            ->orWhereHas('user', fn ($userQuery) =>
                                $userQuery->where('name', 'like', "%{$search}%")
                            );
                    });
                })
                ->when($request->filled('area_id'), fn ($query) =>
                    $query->where('area_id', $request->integer('area_id'))
                )
                ->when($request->filled('sub_area_id'), fn ($query) =>
                    $query->where('sub_area_id', $request->integer('sub_area_id'))
                )
                ->when($request->filled('rating'), fn ($query) =>
                    $query->where('rating', $request->integer('rating'))
                )
                ->when($request->filled('status'), fn ($query) =>
                    $query->where('status', $request->status)
                )
                ->when($request->filled('period'), function ($query) use ($request) {
                    $period = $request->period;
                    $now = now();

                    match ($period) {
                        'today' => $query->whereDate('created_at', $now->toDateString()),
                        'week' => $query->where('created_at', '>=', $now->subDays(7)),
                        'month' => $query->where('created_at', '>=', $now->subDays(30)),
                        'this_month' => $query->whereMonth('created_at', $now->month)->whereYear('created_at', $now->year),
                        'this_year' => $query->whereYear('created_at', $now->year),
                        default => null,
                    };
                })
                ->latest()
                ->paginate(10)
                ->withQueryString();

            $statQuery = AreaReview::query()
                ->when($request->filled('area_id'), fn ($q) => $q->where('area_id', $request->integer('area_id')))
                ->when($request->filled('sub_area_id'), fn ($q) => $q->where('sub_area_id', $request->integer('sub_area_id')));

            $stats = [
                'total' => (clone $statQuery)->count(),
                'approved' => (clone $statQuery)->where('status', 'approved')->count(),
                'hidden' => (clone $statQuery)->where('status', 'hidden')->count(),
                'average' => round((float) (clone $statQuery)->where('status', 'approved')->avg('rating') ?? 0, 1),
            ];
        }

        $subAreasOptions = [];
        if ($request->filled('area_id')) {
            $subAreasOptions = SubArea::where('area_id', $request->integer('area_id'))
                ->orderBy('sort_order')
                ->get();
        }

        return Inertia::render('admin/review/index', [
            'tab' => $tab,
            'areas' => $areas,
            'allAreas' => $allAreas,
            'reviews' => $reviews,
            'stats' => $stats,
            'filters' => $request->only(['search', 'area_id', 'sub_area_id', 'rating', 'status', 'period']),
            'subAreasOptions' => $subAreasOptions,
        ]);
    }

    public function show(AreaReview $review): \Illuminate\Http\JsonResponse
    {
        $review->load(['area', 'subArea', 'user', 'approver']);

        return response()->json([
            'review' => $review,
        ]);
    }

    public function hide(AreaReview $review): RedirectResponse
    {
        $review->forceFill([
            'status' => 'hidden',
        ])->save();

        return back()->with('success', 'Review berhasil disembunyikan.');
    }

    public function restore(AreaReview $review): RedirectResponse
    {
        $review->forceFill([
            'status' => 'approved',
        ])->save();

        return back()->with('success', 'Review berhasil ditampilkan kembali.');
    }

    public function destroy(AreaReview $review): RedirectResponse
    {
        $review->delete();

        return back()->with('success', 'Review berhasil dihapus.');
    }
}
