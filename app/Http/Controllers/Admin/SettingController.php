<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\OptionHelper;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/settings', [
            'options' => OptionHelper::all(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'area' => ['required', 'array', 'min:1'],
            'area.*' => ['required', 'string', 'distinct'],
            'sub_area' => ['nullable', 'array'],
            'jenis_sampah' => ['required', 'array', 'min:1'],
            'jenis_sampah.*' => ['required', 'string', 'distinct'],
            'tujuan_distribusi' => ['required', 'array', 'min:1'],
            'tujuan_distribusi.*' => ['required', 'string', 'distinct'],
        ]);

        OptionHelper::save($validated);

        return redirect()->route('settings.index');
    }
}
