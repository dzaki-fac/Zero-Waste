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
        $nama = $request->user()->name;

        if ($request->input('_redirect') === '/form') {
            $items = $request->input('items', []);
            $created = [];

            foreach ($items as $item) {
                $berat = $item['berat'] ?? null;
                if ($berat === null || $berat === '' || (float) $berat <= 0) {
                    continue;
                }

                $pilahSampah = PilahSampah::create([
                    'nama' => $nama,
                    'tanggal' => $request->input('tanggal'),
                    'jenis_sampah' => $item['jenis_sampah'],
                    'berat' => $berat,
                ]);
                $created[] = $pilahSampah->toArray();
            }

            if (empty($created)) {
                return back()->withErrors(['items' => 'Minimal isi berat pada 1 jenis sampah']);
            }

            return redirect('/form/pilah-sampah')->with('submitted', [
                'nama' => $nama,
                'tanggal' => $request->input('tanggal'),
                'items' => $created,
                'total_berat' => array_sum(array_column($created, 'berat')),
            ]);
        }

        $pilahSampah = PilahSampah::create([
            ...$request->validated(),
            'nama' => $nama,
        ]);

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
