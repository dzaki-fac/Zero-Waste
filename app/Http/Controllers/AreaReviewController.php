<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAreaReviewRequest;
use App\Models\Area;
use App\Models\AreaReview;
use App\Models\SubArea;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AreaReviewController extends Controller
{
    public function index(Request $request): Response
    {
        $areaId = $request->integer('area_id');
        $subAreaId = $request->integer('sub_area_id');
        $ratingFilter = $request->integer('rating');

        $areas = Area::with(['subAreas' => fn ($q) => $q->where('is_active', true)->orderBy('sort_order')])
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $subAreasOptions = [];
        if ($areaId) {
            $subAreasOptions = SubArea::where('area_id', $areaId)
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get();
        }

        $baseQuery = AreaReview::where('status', 'approved')
            ->when($areaId, fn ($q) => $q->where('area_id', $areaId))
            ->when($subAreaId, fn ($q) => $q->where('sub_area_id', $subAreaId))
            ->when($ratingFilter, fn ($q) => $q->where('rating', $ratingFilter));

        $reviews = (clone $baseQuery)
            ->with(['area', 'subArea', 'user'])
            ->latest()
            ->paginate(5)
            ->withQueryString();

        $stats = (clone $baseQuery)
            ->selectRaw('COUNT(*) as total, AVG(rating) as average')
            ->first();

        $totalReviews = (int) ($stats->total ?? 0);
        $averageRating = round((float) ($stats->average ?? 0), 1);

        $distribution = (clone $baseQuery)
            ->selectRaw('rating, COUNT(*) as count')
            ->groupBy('rating')
            ->orderBy('rating', 'desc')
            ->pluck('count', 'rating')
            ->toArray();

        $ratingDistribution = [];
        for ($i = 5; $i >= 1; $i--) {
            $count = $distribution[$i] ?? 0;
            $ratingDistribution[$i] = [
                'count' => $count,
                'percentage' => $totalReviews > 0 ? round(($count / $totalReviews) * 100, 1) : 0,
            ];
        }

        return Inertia::render('review/index', [
            'areas' => $areas,
            'reviews' => $reviews,
            'filters' => [
                'area_id' => $areaId ?: null,
                'sub_area_id' => $subAreaId ?: null,
                'rating' => $ratingFilter ?: null,
            ],
            'subAreasOptions' => $subAreasOptions,
            'stats' => [
                'total' => $totalReviews,
                'average' => $averageRating,
                'distribution' => $ratingDistribution,
            ],
        ]);
    }

    public function store(StoreAreaReviewRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        AreaReview::create([
            ...$validated,
            'status' => 'approved',
            'approved_at' => now(),
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('review.index')->with('success', 'Review berhasil dikirim.');
    }
}
