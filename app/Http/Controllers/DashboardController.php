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
        $penimbanganByArea = Penimbangan::select('area', DB::raw('SUM(berat_sampah) as total'))
            ->groupBy('area')
            ->pluck('total', 'area')
            ->map(fn ($total, $area) => ['name' => $area, 'value' => (float) $total])
            ->values()
            ->toArray();

        $pilahByJenis = PilahSampah::select('jenis_sampah', DB::raw('SUM(berat) as total'))
            ->groupBy('jenis_sampah')
            ->pluck('total', 'jenis_sampah')
            ->map(fn ($total, $jenis) => ['name' => $jenis, 'value' => (float) $total])
            ->values()
            ->toArray();

        $distribusiByTujuan = Distribusi::select('tujuan_distribusi', DB::raw('SUM(berat) as total'))
            ->groupBy('tujuan_distribusi')
            ->pluck('total', 'tujuan_distribusi')
            ->map(fn ($total, $tujuan) => ['name' => $tujuan, 'value' => (float) $total])
            ->values()
            ->toArray();

        $petugasStats = User::where('role', 'petugas')
            ->get()
            ->map(function ($user) {
                $penimbangan = Penimbangan::where('nama', $user->name)
                    ->selectRaw('COUNT(*) as jumlah, COALESCE(SUM(berat_sampah), 0) as total_berat')
                    ->first();

                $pilah = PilahSampah::where('nama', $user->name)
                    ->selectRaw('COUNT(*) as jumlah, COALESCE(SUM(berat), 0) as total_berat')
                    ->first();

                $distribusi = Distribusi::where('nama', $user->name)
                    ->selectRaw('COUNT(*) as jumlah, COALESCE(SUM(berat), 0) as total_berat')
                    ->first();

                return [
                    'name' => $user->name,
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

        return Inertia::render('dashboard', [
            'penimbanganByArea' => $penimbanganByArea,
            'pilahByJenis' => $pilahByJenis,
            'distribusiByTujuan' => $distribusiByTujuan,
            'petugasStats' => $petugasStats,
        ]);
    }
}
