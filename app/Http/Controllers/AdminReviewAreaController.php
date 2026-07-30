<?php

namespace App\Http\Controllers;

use App\Http\Requests\Admin\StoreAreaRequest;
use App\Http\Requests\Admin\UpdateAreaRequest;
use App\Models\Area;
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

    public function toggleStatus(Area $area): RedirectResponse
    {
        $newStatus = !$area->is_active;

        if (!$newStatus && $area->areaReviews()->exists()) {
            $area->update(['is_active' => false]);

            return back()->with('success', 'Area berhasil dinonaktifkan. Review yang sudah ada tetap tersimpan.');
        }

        $area->update(['is_active' => $newStatus]);

        $message = $newStatus ? 'Area berhasil diaktifkan.' : 'Area berhasil dinonaktifkan.';

        return back()->with('success', $message);
    }
}
