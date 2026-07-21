<?php

namespace App\Http\Controllers;

use App\Http\Requests\PenimbanganRequest;
use App\Models\Penimbangan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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

        $redirect = $request->input('_redirect');

        if (in_array($redirect, ['/form', '/admin'])) {
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
                return back()->withErrors(['items' => 'Minimal isi berat pada 1 jenis sampah']);
            }

            if ($redirect === '/form') {
                return redirect('/form/penimbangan')->with('submitted', [
                    'nama' => $nama,
                    'tanggal' => $request->input('tanggal'),
                    'area' => $request->input('area'),
                    'items' => $created,
                    'total_berat' => array_sum(array_column($created, 'berat_sampah')),
                ]);
            }

            return redirect()->route($this->routePrefix() . '.penimbangan.index')->with('success', 'Data penimbangan berhasil disimpan.');
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

    public function export(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $user = auth()->user();
        $query = Penimbangan::visibleTo($user);

        if ($search = $request->query('search')) {
            $query->where('nama', 'like', "%{$search}%");
        }

        if ($area = $request->query('filter_area')) {
            if ($area !== 'all') {
                $query->where('area', $area);
            }
        }

        if ($jenis = $request->query('filter_jenis')) {
            if ($jenis !== 'all') {
                $query->where('jenis_sampah', $jenis);
            }
        }

        $this->applyDateFilter($query, $request);

        $records = $query->latest('tanggal')->get();

        $filename = 'penimbangan_' . now()->toDateString() . '.csv';

        $headers = ['No', 'Nama', 'Tanggal', 'Berat (kg)', 'Jenis', 'Area'];

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
                    $record->area ?? '-',
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
