<?php

namespace App\Http\Controllers;

use App\Http\Requests\PilahSampahRequest;
use App\Models\PilahSampah;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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

        $redirect = $request->input('_redirect');

        if (in_array($redirect, ['/form', '/admin'])) {
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
                    'user_id' => auth()->id(),
                ]);
                $created[] = $pilahSampah->toArray();
            }

            if (empty($created)) {
                return back()->withErrors(['items' => 'Minimal isi berat pada 1 jenis sampah']);
            }

            if ($redirect === '/form') {
                return redirect('/form/pilah-sampah')->with('submitted', [
                    'nama' => $nama,
                    'tanggal' => $request->input('tanggal'),
                    'items' => $created,
                    'total_berat' => array_sum(array_column($created, 'berat')),
                ]);
            }

            return redirect()->route($this->routePrefix() . '.pilah-sampah.index')->with('success', 'Data pilah sampah berhasil disimpan.');
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

    public function export(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $user = auth()->user();
        $query = PilahSampah::visibleTo($user);

        if ($search = $request->query('search')) {
            $query->where('nama', 'like', "%{$search}%");
        }

        if ($jenis = $request->query('filter_jenis')) {
            if ($jenis !== 'all') {
                $query->where('jenis_sampah', $jenis);
            }
        }

        $this->applyDateFilter($query, $request);

        $records = $query->latest('tanggal')->get();

        $filename = 'pilah_sampah_' . now()->toDateString() . '.csv';

        $headers = ['No', 'Nama', 'Tanggal', 'Berat (kg)', 'Jenis'];

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
                    $record->jenis_sampah ?? '-',
                ]);
            }

            fclose($file);
        };

        return response()->streamDownload($callback, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    private function applyDateFilter($query, Request $request): void
    {
        $period = $request->query('filter_period', 'all');

        switch ($period) {
            case 'harian':
                $query->whereDate('tanggal', now()->toDateString());
                break;
            case 'mingguan':
                $days = (int) $request->query('week_range', 7);
                $start = now()->subDays($days - 1)->startOfDay();
                $end = now()->addDay()->startOfDay();
                $query->where('tanggal', '>=', $start)->where('tanggal', '<', $end);
                break;
            case 'bulanan':
                $month = (int) $request->query('month', now()->month);
                $year = (int) $request->query('year', now()->year);
                $query->whereYear('tanggal', $year)->whereMonth('tanggal', $month);
                break;
            case 'tahunan':
                $year = (int) $request->query('year', now()->year);
                $query->whereYear('tanggal', $year);
                break;
            case 'custom':
                $start = $request->query('custom_start');
                $end = $request->query('custom_end');
                if ($start && $end) {
                    $query->where('tanggal', '>=', $start)->where('tanggal', '<', $end . ' 23:59:59');
                }
                break;
        }
    }
}