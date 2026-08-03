<?php

namespace App\Http\Controllers;

use App\Http\Requests\Admin\StoreSubAreaRequest;
use App\Http\Requests\Admin\UpdateSubAreaRequest;
use App\Models\SubArea;
use Illuminate\Http\RedirectResponse;

class AdminReviewSubAreaController extends Controller
{
    public function store(StoreSubAreaRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        SubArea::create([
            'area_id' => $validated['area_id'],
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return back()->with('success', 'Bagian berhasil ditambahkan.');
    }

    public function update(UpdateSubAreaRequest $request, SubArea $subArea): RedirectResponse
    {
        $validated = $request->validated();

        $subArea->update([
            'area_id' => $validated['area_id'],
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'sort_order' => $validated['sort_order'] ?? $subArea->sort_order,
            'is_active' => $validated['is_active'] ?? $subArea->is_active,
        ]);

        return back()->with('success', 'Bagian berhasil diperbarui.');
    }

    public function destroy(SubArea $subArea): RedirectResponse
    {
        $subArea->areaReviews()->delete();
        $subArea->delete();

        return back()->with('success', 'Bagian beserta review terkait berhasil dihapus.');
    }
}
