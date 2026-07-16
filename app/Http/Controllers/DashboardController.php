<?php

namespace App\Http\Controllers;

use App\Models\Distribusi;
use App\Models\Penimbangan;
use App\Models\PilahSampah;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $user = $request->user();

        $penimbanganQuery = Penimbangan::visibleTo($user);
        $pilahQuery = PilahSampah::visibleTo($user);
        $distribusiQuery = Distribusi::visibleTo($user);

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

        $penimbanganByArea = Penimbangan::visibleTo($user)
            ->when($startDate, fn ($q) => $q->where('tanggal', '>=', $startDate))
            ->when($endDate, fn ($q) => $q->where('tanggal', '<=', $endDate))
            ->select('area', DB::raw('SUM(berat_sampah) as total'))
            ->groupBy('area')
            ->pluck('total', 'area')
            ->map(fn ($total, $area) => ['name' => $area, 'value' => (float) $total])
            ->values()
            ->toArray();

        $pilahByJenis = PilahSampah::visibleTo($user)
            ->when($startDate, fn ($q) => $q->where('tanggal', '>=', $startDate))
            ->when($endDate, fn ($q) => $q->where('tanggal', '<=', $endDate))
            ->select('jenis_sampah', DB::raw('SUM(berat) as total'))
            ->groupBy('jenis_sampah')
            ->pluck('total', 'jenis_sampah')
            ->map(fn ($total, $jenis) => ['name' => $jenis, 'value' => (float) $total])
            ->values()
            ->toArray();

        $distribusiByTujuan = Distribusi::visibleTo($user)
            ->when($startDate, fn ($q) => $q->where('tanggal', '>=', $startDate))
            ->when($endDate, fn ($q) => $q->where('tanggal', '<=', $endDate))
            ->select('tujuan_distribusi', DB::raw('SUM(berat) as total'))
            ->groupBy('tujuan_distribusi')
            ->pluck('total', 'tujuan_distribusi')
            ->map(fn ($total, $tujuan) => ['name' => $tujuan, 'value' => (float) $total])
            ->values()
            ->toArray();

        $petugasQuery = User::where('role', 'petugas');

        if ($user->role === 'petugas') {
            $petugasQuery->where('id', $user->id);
        }

        $petugasStats = $petugasQuery
            ->get()
            ->map(function ($petugas) use ($startDate, $endDate) {
                $penimbangan = Penimbangan::where('user_id', $petugas->id)
                    ->when($startDate, fn ($q) => $q->where('tanggal', '>=', $startDate))
                    ->when($endDate, fn ($q) => $q->where('tanggal', '<=', $endDate))
                    ->selectRaw('COUNT(*) as jumlah, COALESCE(SUM(berat_sampah), 0) as total_berat')
                    ->first();

                $pilah = PilahSampah::where('user_id', $petugas->id)
                    ->when($startDate, fn ($q) => $q->where('tanggal', '>=', $startDate))
                    ->when($endDate, fn ($q) => $q->where('tanggal', '<=', $endDate))
                    ->selectRaw('COUNT(*) as jumlah, COALESCE(SUM(berat), 0) as total_berat')
                    ->first();

                $distribusi = Distribusi::where('user_id', $petugas->id)
                    ->when($startDate, fn ($q) => $q->where('tanggal', '>=', $startDate))
                    ->when($endDate, fn ($q) => $q->where('tanggal', '<=', $endDate))
                    ->selectRaw('COUNT(*) as jumlah, COALESCE(SUM(berat), 0) as total_berat')
                    ->first();

                return [
                    'name' => $petugas->name,
                    'penimbangan' => [
                        'jumlah' => (int) $penimbangan->jumlah,
                        'total_berat' => (float) $penimbangan->total_berat,
                    ],
                    'pilah_sampah' => [
                        'jumlah' => (int) $pilah->jumlah,
                        'total_berat' => (float) $pilah->total_berat,
                    ],
                    'distribusi' => [
                        'jumlah' => (int) $distribusi->jumlah,
                        'total_berat' => (float) $distribusi->total_berat,
                    ],
                ];
            });

        $statusBerat = [
            'belum_dipilah' => max(0, $totalPenimbangan - $totalPilah),
            'belum_didistribusikan' => max(0, $totalPilah - $totalDistribusi),
            'sudah_didistribusikan' => $totalDistribusi,
        ];

        return Inertia::render('dashboard', [
            'penimbanganByArea' => $penimbanganByArea,
            'pilahByJenis' => $pilahByJenis,
            'distribusiByTujuan' => $distribusiByTujuan,
            'petugasStats' => $petugasStats,
            'statusBerat' => $statusBerat,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }
}
