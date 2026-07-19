<?php

namespace App\Http\Controllers;

use App\Helpers\OptionHelper;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
            'subjenis_sampah' => ['required', 'array', 'min:1'],
            'subjenis_sampah.*' => ['required', 'string', 'distinct'],
            'tujuan_distribusi' => ['required', 'array', 'min:1'],
            'tujuan_distribusi.*' => ['required', 'string', 'distinct'],
        ]);

        OptionHelper::save($validated);

        return redirect()->route('settings.index');
    }
}