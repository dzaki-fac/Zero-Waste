<?php

namespace App\Http\Controllers;

use App\Http\Requests\PenimbanganRequest;
use App\Models\Penimbangan;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PenimbanganController extends Controller
{
    public function index(): Response
    {
        $penimbangan = Penimbangan::latest('tanggal')->get();

        return Inertia::render('penimbangan/index', [
            'penimbangan' => $penimbangan,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('penimbangan/create');
    }

    public function store(PenimbanganRequest $request): RedirectResponse
    {
        Penimbangan::create($request->validated());

        return to_route('penimbangan.index');
    }

    public function edit(Penimbangan $penimbangan): Response
    {
        return Inertia::render('penimbangan/edit', [
            'penimbangan' => $penimbangan,
        ]);
    }

    public function update(PenimbanganRequest $request, Penimbangan $penimbangan): RedirectResponse
    {
        $penimbangan->update($request->validated());

        return to_route('penimbangan.index');
    }

    public function destroy(Penimbangan $penimbangan): RedirectResponse
    {
        $penimbangan->delete();

        return to_route('penimbangan.index');
    }
}
