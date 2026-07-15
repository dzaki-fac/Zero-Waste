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

    public function store(DistribusiRequest $request): RedirectResponse
    {
        $nama = $request->user()->name;

        if ($request->input('_redirect') === '/form') {
            $items = $request->input('items', []);
            $created = [];

            foreach ($items as $item) {
                $berat = $item['berat'] ?? null;
                if ($berat === null || $berat === '' || (float) $berat <= 0) {
                    continue;
                }

                $distribusi = Distribusi::create([
                    'nama' => $nama,
                    'tanggal' => $request->input('tanggal'),
                    'jenis_sampah' => $item['jenis_sampah'],
                    'berat' => $berat,
                    'tujuan_distribusi' => $request->input('tujuan_distribusi'),
                    'lokasi' => $request->input('lokasi'),
                ]);
                $created[] = $distribusi->toArray();
            }

            if (empty($created)) {
                return back()->withErrors(['items' => 'Minimal isi berat pada 1 jenis sampah']);
            }

            return redirect('/form/distribusi')->with('submitted', [
                'nama' => $nama,
                'tanggal' => $request->input('tanggal'),
                'items' => $created,
                'total_berat' => array_sum(array_column($created, 'berat')),
                'tujuan_distribusi' => $request->input('tujuan_distribusi'),
                'lokasi' => $request->input('lokasi'),
            ]);
        }

        $distribusi = Distribusi::create([
            ...$request->validated(),
            'nama' => $nama,
        ]);

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
