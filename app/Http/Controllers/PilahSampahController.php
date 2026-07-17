<?php

namespace App\Http\Controllers;

use App\Http\Requests\PilahSampahRequest;
use App\Models\PilahSampah;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PilahSampahController extends Controller
{
    private function routePrefix(): string
    {
        return auth()->user()->role === 'admin' ? 'admin' : 'petugas';
    }

    public function index(): Response
    {
        $pilahSampah = PilahSampah::visibleTo(auth()->user())
            ->latest('tanggal')
            ->get();

        $totalWeight = (float) PilahSampah::visibleTo(auth()->user())
            ->sum('berat');

        return Inertia::render('pilah-sampah/index', [
            'pilahSampah' => $pilahSampah,
            'totalWeight' => $totalWeight,
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
                    'subjenis_sampah' => $item['subjenis_sampah'],
                    'berat' => $berat,
                    'user_id' => auth()->id(),
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
            'user_id' => auth()->id(),
        ]);

        return to_route($this->routePrefix() . '.pilah-sampah.index');
    }

    public function edit(PilahSampah $pilahSampah): Response
    {
        $this->authorize('view', $pilahSampah);

        return Inertia::render('pilah-sampah/edit', [
            'pilahSampah' => $pilahSampah,
        ]);
    }

    public function update(PilahSampahRequest $request, PilahSampah $pilahSampah): RedirectResponse
    {
        $this->authorize('update', $pilahSampah);

        $pilahSampah->update($request->validated());

        return to_route($this->routePrefix() . '.pilah-sampah.index');
    }

    public function destroy(PilahSampah $pilahSampah): RedirectResponse
    {
        $this->authorize('delete', $pilahSampah);

        $pilahSampah->delete();

        return to_route($this->routePrefix() . '.pilah-sampah.index');
    }

    public function export(): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $user = auth()->user();
        $records = PilahSampah::visibleTo($user)
            ->latest('tanggal')
            ->get();

        $filename = 'pilah_sampah_' . now()->toDateString() . '.csv';

        $headers = ['No', 'Nama', 'Tanggal', 'Berat (kg)', 'Subjenis'];

        $callback = function () use ($records, $headers) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));
            fputcsv($file, $headers);

            $index = 1;
            foreach ($records as $record) {
                fputcsv($file, [
                    $index++,
                    $record->nama,
                    $record->tanggal,
                    $record->berat,
                    $record->subjenis_sampah ?? '-',
                ]);
            }

            fclose($file);
        };

        return response()->streamDownload($callback, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}