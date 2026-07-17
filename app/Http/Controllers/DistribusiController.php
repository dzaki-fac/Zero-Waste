<?php

namespace App\Http\Controllers;

use App\Http\Requests\DistribusiRequest;
use App\Models\Distribusi;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DistribusiController extends Controller
{
    private function routePrefix(): string
    {
        return auth()->user()->role === 'admin' ? 'admin' : 'petugas';
    }

    public function index(): Response
    {
        $distribusi = Distribusi::visibleTo(auth()->user())
            ->latest('tanggal')
            ->get();

        $totalWeight = (float) Distribusi::visibleTo(auth()->user())
            ->sum('berat');

        return Inertia::render('distribusi/index', [
            'distribusi' => $distribusi,
            'totalWeight' => $totalWeight,
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
                    'jenis_sampah' => $item['subjenis_sampah'],
                    'berat' => $berat,
                    'tujuan_distribusi' => $request->input('tujuan_distribusi'),
                    'lokasi' => $request->input('lokasi'),
                    'user_id' => auth()->id(),
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
            'user_id' => auth()->id(),
        ]);

        return to_route($this->routePrefix() . '.distribusi.index');
    }

    public function edit(Distribusi $distribusi): Response
    {
        $this->authorize('view', $distribusi);

        return Inertia::render('distribusi/edit', [
            'distribusi' => $distribusi,
        ]);
    }

    public function update(DistribusiRequest $request, Distribusi $distribusi): RedirectResponse
    {
        $this->authorize('update', $distribusi);

        $distribusi->update($request->validated());

        return to_route($this->routePrefix() . '.distribusi.index');
    }

    public function destroy(Distribusi $distribusi): RedirectResponse
    {
        $this->authorize('delete', $distribusi);

        $distribusi->delete();

        return to_route($this->routePrefix() . '.distribusi.index');
    }

    public function export(): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $user = auth()->user();
        $records = Distribusi::visibleTo($user)
            ->latest('tanggal')
            ->get();

        $filename = 'distribusi_' . now()->toDateString() . '.csv';

        $headers = ['No', 'Nama', 'Tanggal', 'Berat (kg)', 'Subjenis', 'Tujuan', 'Lokasi'];

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
                    $record->jenis_sampah,
                    $record->tujuan_distribusi,
                    $record->lokasi,
                ]);
            }

            fclose($file);
        };

        return response()->streamDownload($callback, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}