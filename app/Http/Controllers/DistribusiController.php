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
        $distribusi = Distribusi::create([
            ...$request->validated(),
            'nama' => $request->user()->name,
            'user_id' => auth()->id(),
        ]);

        if ($request->input('_redirect') === '/form') {
            return redirect('/form/distribusi')->with('submitted', $distribusi->toArray());
        }

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

        $headers = ['No', 'Nama', 'Tanggal', 'Berat (kg)', 'Jenis Sampah', 'Tujuan', 'Lokasi'];

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
