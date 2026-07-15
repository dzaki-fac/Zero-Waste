<?php

namespace App\Http\Controllers;

use App\Http\Requests\PilahSampahRequest;
use App\Models\PilahSampah;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PilahSampahController extends Controller
{
    public function index(): Response
    {
        $pilahSampah = PilahSampah::latest('tanggal')->get();

        return Inertia::render('pilah-sampah/index', [
            'pilahSampah' => $pilahSampah,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('pilah-sampah/create');
    }

    public function store(PilahSampahRequest $request): RedirectResponse
    {
        $pilahSampah = PilahSampah::create([
            ...$request->validated(),
            'nama' => $request->user()->name,
        ]);

        if ($request->input('_redirect') === '/form') {
            return redirect('/form/pilah-sampah')->with('submitted', $pilahSampah->toArray());
        }

        return to_route('pilah-sampah.index');
    }

    public function edit(PilahSampah $pilahSampah): Response
    {
        return Inertia::render('pilah-sampah/edit', [
            'pilahSampah' => $pilahSampah,
        ]);
    }

    public function update(PilahSampahRequest $request, PilahSampah $pilahSampah): RedirectResponse
    {
        $pilahSampah->update($request->validated());

        return to_route('pilah-sampah.index');
    }

    public function destroy(PilahSampah $pilahSampah): RedirectResponse
    {
        $pilahSampah->delete();

        return to_route('pilah-sampah.index');
    }
}
