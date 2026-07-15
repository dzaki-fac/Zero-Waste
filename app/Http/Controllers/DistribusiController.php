<?php

namespace App\Http\Controllers;

use App\Http\Requests\DistribusiRequest;
use App\Models\Distribusi;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DistribusiController extends Controller
{
    public function index(): Response
    {
        $distribusi = Distribusi::latest('tanggal')->get();

        return Inertia::render('distribusi/index', [
            'distribusi' => $distribusi,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('distribusi/create');
    }

    public function store(DistribusiRequest $request): RedirectResponse|Response
    {
        $distribusi = Distribusi::create([
            ...$request->validated(),
            'nama' => $request->user()->name,
        ]);

        if ($request->input('_redirect') === '/form') {
            return Inertia::render('form/distribusi', [
                'submitted' => $distribusi->toArray(),
            ]);
        }

        return to_route('distribusi.index');
    }

    public function edit(Distribusi $distribusi): Response
    {
        return Inertia::render('distribusi/edit', [
            'distribusi' => $distribusi,
        ]);
    }

    public function update(DistribusiRequest $request, Distribusi $distribusi): RedirectResponse
    {
        $distribusi->update($request->validated());

        return to_route('distribusi.index');
    }

    public function destroy(Distribusi $distribusi): RedirectResponse
    {
        $distribusi->delete();

        return to_route('distribusi.index');
    }
}
