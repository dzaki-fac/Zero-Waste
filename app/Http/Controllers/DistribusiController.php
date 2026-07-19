<?php

namespace App\Http\Controllers;

use App\Http\Requests\DistribusiRequest;
use App\Http\Requests\ReviewDistribusiRequest;
use App\Models\Distribusi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
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

        $redirect = $request->input('_redirect');

        if (in_array($redirect, ['/form', '/admin'])) {
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

            if ($redirect === '/form') {
                return redirect('/form/distribusi')->with('submitted', [
                    'nama' => $nama,
                    'tanggal' => $request->input('tanggal'),
                    'items' => $created,
                    'total_berat' => array_sum(array_column($created, 'berat')),
                    'tujuan_distribusi' => $request->input('tujuan_distribusi'),
                    'lokasi' => $request->input('lokasi'),
                ]);
            }

            return redirect()->route($this->routePrefix() . '.distribusi.index')->with('success', 'Data distribusi berhasil disimpan.');
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

        $data = $request->validated();

        if ($distribusi->review_status === 'needs_revision') {
            $data['review_status'] = 'pending';
            $data['review_note'] = null;
            $data['reviewed_by'] = null;
            $data['reviewed_at'] = null;
            $data['revision_submitted_at'] = now();
        }

        $distribusi->forceFill($data)->save();

        if ($distribusi->wasChanged('review_status') && $distribusi->review_status === 'pending') {
            return to_route($this->routePrefix() . '.distribusi.index')
                ->with('success', 'Perbaikan berhasil dikirim dan menunggu peninjauan admin.');
        }

        return to_route($this->routePrefix() . '.distribusi.index');
    }

    public function destroy(Distribusi $distribusi): RedirectResponse
    {
        $this->authorize('delete', $distribusi);

        $distribusi->delete();

        return to_route($this->routePrefix() . '.distribusi.index');
    }

    public function review(ReviewDistribusiRequest $request, Distribusi $distribusi): RedirectResponse
    {
        $admin = $request->user();

        abort_unless($admin !== null && $admin->role === 'admin', 403);

        $validated = $request->validated();
        $status = $validated['status'];

        DB::transaction(function () use ($distribusi, $validated, $admin, $status) {
            $distribusi->forceFill([
                'review_status' => $status,
                'review_note' => $status === 'needs_revision' ? $validated['note'] : null,
                'reviewed_by' => $admin->id,
                'reviewed_at' => now(),
            ])->save();
        });

        return back()->with('success', 'Status distribusi berhasil diperbarui.');
    }

    public function export(): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $user = auth()->user();
        $records = Distribusi::visibleTo($user)
            ->latest('tanggal')
            ->get();

        $filename = 'distribusi_' . now()->toDateString() . '.csv';

        $headers = ['No', 'Nama', 'Tanggal', 'Berat (kg)', 'Jenis Sampah', 'Tujuan', 'Lokasi', 'Status Review', 'Catatan Perbaikan', 'Ditinjau Oleh', 'Tanggal Ditinjau'];

        $callback = function () use ($records, $headers) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));
            fputcsv($file, $headers);

            $statusLabels = [
                'pending' => 'Menunggu Review',
                'approved' => 'Disetujui',
                'needs_revision' => 'Butuh Perbaikan',
                'rejected' => 'Ditolak',
            ];

            $index = 1;
            foreach ($records as $record) {
                fputcsv($file, [
                    $index++,
                    $record->nama,
                    $record->tanggal,
                    $record->berat,
                    $record->subjenis_sampah ?? $record->jenis_sampah,
                    $record->tujuan_distribusi,
                    $record->lokasi,
                    $statusLabels[$record->review_status] ?? 'Menunggu Review',
                    $record->review_note ?? '',
                    $record->reviewedBy?->name ?? '',
                    $record->reviewed_at ?? '',
                ]);
            }

            fclose($file);
        };

        return response()->streamDownload($callback, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}