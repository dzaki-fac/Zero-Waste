<?php

namespace App\Http\Controllers;

use App\Http\Requests\Admin\StoreAreaRequest;
use App\Http\Requests\Admin\UpdateAreaRequest;
use App\Models\Area;
use App\Models\SubArea;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AdminReviewAreaController extends Controller
{
    public function store(StoreAreaRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Area::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return back()->with('success', 'Area berhasil ditambahkan.');
    }

    public function update(UpdateAreaRequest $request, Area $area): RedirectResponse
    {
        $validated = $request->validated();

        $area->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'sort_order' => $validated['sort_order'] ?? $area->sort_order,
            'is_active' => $validated['is_active'] ?? $area->is_active,
        ]);

        return back()->with('success', 'Area berhasil diperbarui.');
    }

    public function destroy(Area $area): RedirectResponse
    {
        $area->subAreas->each(function (SubArea $subArea) {
            $subArea->areaReviews()->delete();
            $subArea->delete();
        });

        $area->areaReviews()->delete();
        $area->delete();

        return back()->with('success', 'Area beserta bagian dan review-nya berhasil dihapus.');
    }
}
