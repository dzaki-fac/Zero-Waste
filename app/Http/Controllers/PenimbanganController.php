<?php

namespace App\Http\Controllers;

use App\Http\Requests\PenimbanganRequest;
use App\Models\Penimbangan;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PenimbanganController extends Controller
{
    private function routePrefix(): string
    {
        return auth()->user()->role === 'admin' ? 'admin' : 'petugas';
    }

    public function index(): Response
    {
        $penimbangan = Penimbangan::visibleTo(auth()->user())
            ->latest('tanggal')
            ->get();

        $totalWeight = (float) Penimbangan::visibleTo(auth()->user())
            ->sum('berat_sampah');

        return Inertia::render('penimbangan/index', [
            'penimbangan' => $penimbangan,
            'totalWeight' => $totalWeight,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('penimbangan/create');
    }

    public function store(PenimbanganRequest $request): RedirectResponse
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

                $penimbangan = Penimbangan::create([
                    'nama' => $nama,
                    'tanggal' => $request->input('tanggal'),
                    'area' => $request->input('area'),
                    'jenis_sampah' => $item['jenis_sampah'],
                    'berat_sampah' => $berat,
                    'user_id' => auth()->id(),
                ]);
                $created[] = $penimbangan->toArray();
            }

            if (empty($created)) {
                return back()->withErrors(['items' => 'Minimal isi berat pada 1 subjenis sampah']);
            }

            return redirect('/form/penimbangan')->with('submitted', [
                'nama' => $nama,
                'tanggal' => $request->input('tanggal'),
                'items' => $created,
                'total_berat' => array_sum(array_column($created, 'berat_sampah')),
            ]);
        }

        $penimbangan = Penimbangan::create([
            ...$request->validated(),
            'nama' => $nama,
            'user_id' => auth()->id(),
        ]);

        return to_route($this->routePrefix() . '.penimbangan.index');
    }

    public function edit(Penimbangan $penimbangan): Response
    {
        $this->authorize('view', $penimbangan);

        return Inertia::render('penimbangan/edit', [
            'penimbangan' => $penimbangan,
        ]);
    }

    public function update(PenimbanganRequest $request, Penimbangan $penimbangan): RedirectResponse
    {
        $this->authorize('update', $penimbangan);

        $penimbangan->update($request->validated());

        return to_route($this->routePrefix() . '.penimbangan.index');
    }

    public function destroy(Penimbangan $penimbangan): RedirectResponse
    {
        $this->authorize('delete', $penimbangan);

        $penimbangan->delete();

        return to_route($this->routePrefix() . '.penimbangan.index');
    }

    public function export(): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $user = auth()->user();
        $records = Penimbangan::visibleTo($user)
            ->latest('tanggal')
            ->get();

        $filename = 'penimbangan_' . now()->toDateString() . '.csv';

        $headers = ['No', 'Nama', 'Tanggal', 'Berat (kg)', 'Jenis', 'Subjenis', 'Area'];

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
                    $record->berat_sampah,
                    $record->jenis_sampah ?? '-',
                    $record->subjenis_sampah ?? '-',
                    $record->area ?? '-',
                ]);
            }

            fclose($file);
        };

        return response()->streamDownload($callback, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}
