<?php

namespace App\Http\Controllers;

use App\Models\Distribusi;
use App\Models\Penimbangan;
use App\Models\PilahSampah;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(Request $request): Response
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $penimbanganQuery = Penimbangan::query();
        $pilahQuery = PilahSampah::query();
        $distribusiQuery = Distribusi::query();

        if ($startDate) {
            $penimbanganQuery->where('tanggal', '>=', $startDate);
            $pilahQuery->where('tanggal', '>=', $startDate);
            $distribusiQuery->where('tanggal', '>=', $startDate);
        }
        if ($endDate) {
            $penimbanganQuery->where('tanggal', '<=', $endDate);
            $pilahQuery->where('tanggal', '<=', $endDate);
            $distribusiQuery->where('tanggal', '<=', $endDate);
        }

        $totalPenimbangan = (float) $penimbanganQuery->sum('berat_sampah');
        $totalPilah = (float) $pilahQuery->sum('berat');
        $totalDistribusi = (float) $distribusiQuery->sum('berat');

        $penimbanganByArea = Penimbangan::query()
            ->when($startDate, fn ($q) => $q->where('tanggal', '>=', $startDate))
            ->when($endDate, fn ($q) => $q->where('tanggal', '<=', $endDate))
            ->select('area', DB::raw('SUM(berat_sampah) as total'))
            ->groupBy('area')
            ->pluck('total', 'area')
            ->map(fn ($total, $area) => ['name' => $area, 'value' => (float) $total])
            ->values()
            ->toArray();

        $pilahByJenis = PilahSampah::query()
            ->when($startDate, fn ($q) => $q->where('tanggal', '>=', $startDate))
            ->when($endDate, fn ($q) => $q->where('tanggal', '<=', $endDate))
            ->select('jenis_sampah', DB::raw('SUM(berat) as total'))
            ->groupBy('jenis_sampah')
            ->pluck('total', 'jenis_sampah')
            ->map(fn ($total, $jenis) => ['name' => $jenis, 'value' => (float) $total])
            ->values()
            ->toArray();

        $distribusiByTujuan = Distribusi::query()
            ->when($startDate, fn ($q) => $q->where('tanggal', '>=', $startDate))
            ->when($endDate, fn ($q) => $q->where('tanggal', '<=', $endDate))
            ->select('tujuan_distribusi', DB::raw('SUM(berat) as total'))
            ->groupBy('tujuan_distribusi')
            ->pluck('total', 'tujuan_distribusi')
            ->map(fn ($total, $tujuan) => ['name' => $tujuan, 'value' => (float) $total])
            ->values()
            ->toArray();

        $statusBerat = [
            'menunggu_pemilahan' => max(0, $totalPenimbangan - $totalPilah),
            'siap_didistribusikan' => max(0, $totalPilah - $totalDistribusi),
            'sudah_didistribusikan' => $totalDistribusi,
        ];

        $distribusiByJenis = Distribusi::query()
            ->when($startDate, fn ($q) => $q->where('tanggal', '>=', $startDate))
            ->when($endDate, fn ($q) => $q->where('tanggal', '<=', $endDate))
            ->select('jenis_sampah', DB::raw('SUM(berat) as total'))
            ->groupBy('jenis_sampah')
            ->pluck('total', 'jenis_sampah')
            ->map(fn ($total) => (float) $total)
            ->toArray();

        $siapDidistribusikanByJenis = collect($pilahByJenis)
            ->map(fn ($item) => [
                'name' => $item['name'],
                'value' => max(0, $item['value'] - ($distribusiByJenis[$item['name']] ?? 0)),
            ])
            ->filter(fn ($item) => $item['value'] > 0)
            ->values()
            ->toArray();

        return Inertia::render('home', [
            'penimbanganByArea' => $penimbanganByArea,
            'pilahByJenis' => $pilahByJenis,
            'distribusiByTujuan' => $distribusiByTujuan,
            'statusBerat' => $statusBerat,
            'siapDidistribusikanByJenis' => $siapDidistribusikanByJenis,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }
}
