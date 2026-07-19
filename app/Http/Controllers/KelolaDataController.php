<?php

namespace App\Http\Controllers;

use App\Helpers\OptionHelper;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class KelolaDataController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('kelola-data/index', [
            'options' => OptionHelper::all(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'area' => ['required', 'array', 'min:1'],
            'area.*' => ['required', 'string', 'distinct'],
            'jenis_sampah' => ['required', 'array', 'min:1'],
            'jenis_sampah.*' => ['required', 'string', 'distinct'],
            'tujuan_distribusi' => ['required', 'array', 'min:1'],
            'tujuan_distribusi.*' => ['required', 'string', 'distinct'],
            'rincian_area' => ['required', 'array', 'size:8'],
            'rincian_area.*.nama' => ['required', 'string', Rule::in([
                'Lantai 1', 'Lantai 2', 'Lantai 3', 'Lantai 4',
                'Area Teras', 'Area Halaman', 'Area Parkir', 'UNDIP Press',
            ])],
            'rincian_area.*.deskripsi' => ['nullable', 'string', 'max:255'],
            'rincian_area.*.luas' => ['required', 'numeric', 'min:0'],
        ]);

        OptionHelper::save($validated);

        return redirect()->route('settings.index');
    }
}
