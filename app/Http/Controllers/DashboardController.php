<?php

namespace App\Http\Controllers;

use App\Helpers\OptionHelper;
use App\Models\ChecklistPekerjaan;
use App\Models\DataDasar;
use App\Models\Distribusi;
use App\Models\MasterPekerjaan;
use App\Models\Penimbangan;
use App\Models\PilahSampah;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
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

        $progressPetugasNip = $request->input('progress_petugas');
        $progressDate = $request->input('progress_date');

        $penimbanganQuery = Penimbangan::visibleTo($user);
        $pilahQuery = PilahSampah::visibleTo($user);
        $distribusiQuery = Distribusi::visibleTo($user);

        if ($startDate) {
            $penimbanganQuery->where('tanggal', '>=', $startDate);
            $pilahQuery->where('tanggal', '>=', $startDate);
            $distribusiQuery->where('tanggal', '>=', $startDate);
        }

        if ($endDate) {
            $endOfDay = Carbon::parse($endDate)->endOfDay();
            $penimbanganQuery->where('tanggal', '<=', $endOfDay);
            $pilahQuery->where('tanggal', '<=', $endOfDay);
            $distribusiQuery->where('tanggal', '<=', $endOfDay);
        }

        $totalPenimbangan = (float) $penimbanganQuery->sum('berat_sampah');
        $totalPilah = (float) $pilahQuery->sum('berat');

        $approvedDistribusiQuery = (clone $distribusiQuery)->where('review_status', 'approved');
        $totalApprovedDistribusi = (float) $approvedDistribusiQuery->sum('berat');

        $penimbanganByArea = Penimbangan::visibleTo($user)
            ->when($startDate, fn ($q) => $q->where('tanggal', '>=', $startDate))
            ->when($endDate, fn ($q) => $q->where('tanggal', '<=', Carbon::parse($endDate)->endOfDay()))
            ->select('area', DB::raw('SUM(berat_sampah) as total'))
            ->groupBy('area')
            ->pluck('total', 'area')
            ->map(fn ($total, $area) => ['name' => $area, 'value' => (float) $total])
            ->values()
            ->toArray();

        $pilahByJenis = PilahSampah::visibleTo($user)
            ->when($startDate, fn ($q) => $q->where('tanggal', '>=', $startDate))
            ->when($endDate, fn ($q) => $q->where('tanggal', '<=', Carbon::parse($endDate)->endOfDay()))
            ->select('jenis_sampah', DB::raw('SUM(berat) as total'))
            ->groupBy('jenis_sampah')
            ->pluck('total', 'jenis_sampah')
            ->map(fn ($total, $sub) => ['name' => $sub, 'value' => (float) $total])
            ->values()
            ->toArray();

        $distribusiByTujuan = Distribusi::visibleTo($user)
            ->where('review_status', 'approved')
            ->when($startDate, fn ($q) => $q->where('tanggal', '>=', $startDate))
            ->when($endDate, fn ($q) => $q->where('tanggal', '<=', Carbon::parse($endDate)->endOfDay()))
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
                    ->when($endDate, fn ($q) => $q->where('tanggal', '<=', Carbon::parse($endDate)->endOfDay()))
                    ->selectRaw('COUNT(*) as jumlah, COALESCE(SUM(berat_sampah), 0) as total_berat')
                    ->first();

                $pilah = PilahSampah::where('user_id', $petugas->id)
                    ->when($startDate, fn ($q) => $q->where('tanggal', '>=', $startDate))
                    ->when($endDate, fn ($q) => $q->where('tanggal', '<=', Carbon::parse($endDate)->endOfDay()))
                    ->selectRaw('COUNT(*) as jumlah, COALESCE(SUM(berat), 0) as total_berat')
                    ->first();

                $distribusi = Distribusi::where('user_id', $petugas->id)
                    ->where('review_status', 'approved')
                    ->when($startDate, fn ($q) => $q->where('tanggal', '>=', $startDate))
                    ->when($endDate, fn ($q) => $q->where('tanggal', '<=', Carbon::parse($endDate)->endOfDay()))
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
            'menunggu_pemilahan' => max(0, $totalPenimbangan - $totalPilah),
            'siap_didistribusikan' => max(0, $totalPilah - $totalApprovedDistribusi),
            'sudah_didistribusikan' => $totalApprovedDistribusi,
        ];

        $distribusiByJenis = Distribusi::query()
            ->where('review_status', 'approved')
            ->when($startDate, fn ($q) => $q->where('tanggal', '>=', $startDate))
            ->when($endDate, fn ($q) => $q->where('tanggal', '<=', Carbon::parse($endDate)->endOfDay()))
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

        $dataDasar = DataDasar::where('user_id', auth()->id())->first();

        $refDate = $progressDate ?: ($endDate ?: ($startDate ?: now()->toDateString()));
        $ref = Carbon::parse($refDate)->startOfDay();
        $startOfWeek = $ref->copy()->startOfWeek();
        $endOfWeek = $ref->copy()->endOfWeek();
        $startOfMonth = $ref->copy()->startOfMonth();
        $endOfMonth = $ref->copy()->endOfMonth();

        $harianTotal = MasterPekerjaan::active()->where('jenis_pekerjaan', 'harian')->count();
        $mingguanTotal = MasterPekerjaan::active()->where('jenis_pekerjaan', 'mingguan')->count();
        $bulananTotal = MasterPekerjaan::active()->where('jenis_pekerjaan', 'bulanan')->count();

        if ($user->role === 'admin') {
            if ($progressPetugasNip && $progressPetugasNip !== 'all') {
                $petugas = User::where('role', 'petugas')->where('nip', $progressPetugasNip)->first();
                $nipProg = $petugas ? $petugas->nip : null;
                $progressPetugasName = $petugas ? $petugas->name : null;
            } else {
                $nipProg = null;
                $progressPetugasName = null;
            }

            if ($nipProg) {
                $harianSelesai = ChecklistPekerjaan::where('nip', $nipProg)
                    ->where('tanggal', $ref->toDateString())
                    ->where('status', 'sudah')
                    ->where('jenis_pekerjaan', 'harian')
                    ->groupBy('master_pekerjaan_id')
                    ->pluck('master_pekerjaan_id')
                    ->count();

                $mingguanSelesai = ChecklistPekerjaan::where('nip', $nipProg)
                    ->whereBetween('tanggal', [$startOfWeek->toDateString(), $endOfWeek->toDateString()])
                    ->where('status', 'sudah')
                    ->where('jenis_pekerjaan', 'mingguan')
                    ->groupBy('master_pekerjaan_id')
                    ->pluck('master_pekerjaan_id')
                    ->count();

                $bulananSelesai = ChecklistPekerjaan::where('nip', $nipProg)
                    ->whereBetween('tanggal', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
                    ->where('status', 'sudah')
                    ->where('jenis_pekerjaan', 'bulanan')
                    ->groupBy('master_pekerjaan_id')
                    ->pluck('master_pekerjaan_id')
                    ->count();
            } else {
                $petugasNips = User::where('role', 'petugas')->whereNotNull('nip')->where('nip', '!=', '')->pluck('nip');

                $harianSelesai = ChecklistPekerjaan::whereIn('nip', $petugasNips)
                    ->where('tanggal', $ref->toDateString())
                    ->where('status', 'sudah')
                    ->where('jenis_pekerjaan', 'harian')
                    ->groupBy('master_pekerjaan_id')
                    ->pluck('master_pekerjaan_id')
                    ->count();

                $mingguanSelesai = ChecklistPekerjaan::whereIn('nip', $petugasNips)
                    ->whereBetween('tanggal', [$startOfWeek->toDateString(), $endOfWeek->toDateString()])
                    ->where('status', 'sudah')
                    ->where('jenis_pekerjaan', 'mingguan')
                    ->groupBy('master_pekerjaan_id')
                    ->pluck('master_pekerjaan_id')
                    ->count();

                $bulananSelesai = ChecklistPekerjaan::whereIn('nip', $petugasNips)
                    ->whereBetween('tanggal', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
                    ->where('status', 'sudah')
                    ->where('jenis_pekerjaan', 'bulanan')
                    ->groupBy('master_pekerjaan_id')
                    ->pluck('master_pekerjaan_id')
                    ->count();
            }
        } else {
            $nip = $user->nip;

            $harianSelesai = ChecklistPekerjaan::where('nip', $nip)
                ->where('tanggal', $ref->toDateString())
                ->where('status', 'sudah')
                ->where('jenis_pekerjaan', 'harian')
                ->groupBy('master_pekerjaan_id')
                ->pluck('master_pekerjaan_id')
                ->count();

            $mingguanSelesai = ChecklistPekerjaan::where('nip', $nip)
                ->whereBetween('tanggal', [$startOfWeek->toDateString(), $endOfWeek->toDateString()])
                ->where('status', 'sudah')
                ->where('jenis_pekerjaan', 'mingguan')
                ->groupBy('master_pekerjaan_id')
                ->pluck('master_pekerjaan_id')
                ->count();

            $bulananSelesai = ChecklistPekerjaan::where('nip', $nip)
                ->whereBetween('tanggal', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
                ->where('status', 'sudah')
                ->where('jenis_pekerjaan', 'bulanan')
                ->groupBy('master_pekerjaan_id')
                ->pluck('master_pekerjaan_id')
                ->count();
        }

        Carbon::setLocale('id');

        $progress = [
            'harian' => [
                'total' => $harianTotal,
                'selesai' => $harianSelesai,
                'persentase' => $harianTotal > 0 ? (int) round(($harianSelesai / $harianTotal) * 100) : 0,
                'periode' => $ref->translatedFormat('d F Y'),
            ],
            'mingguan' => [
                'total' => $mingguanTotal,
                'selesai' => $mingguanSelesai,
                'persentase' => $mingguanTotal > 0 ? (int) round(($mingguanSelesai / $mingguanTotal) * 100) : 0,
                'periode' => $startOfWeek->translatedFormat('d') . ' - ' . $endOfWeek->translatedFormat('d F Y'),
            ],
            'bulanan' => [
                'total' => $bulananTotal,
                'selesai' => $bulananSelesai,
                'persentase' => $bulananTotal > 0 ? (int) round(($bulananSelesai / $bulananTotal) * 100) : 0,
                'periode' => $startOfMonth->translatedFormat('d') . ' - ' . $endOfMonth->translatedFormat('d F Y'),
            ],
        ];

        $checklistStats = null;

        if ($user->role === 'admin') {
            $checklistBase = ChecklistPekerjaan::query();
            if ($startDate) {
                $checklistBase->where('tanggal', '>=', $startDate);
            }
            if ($endDate) {
                $checklistBase->where('tanggal', '<=', Carbon::parse($endDate)->endOfDay());
            }

            $totalTugas = $checklistBase->clone()->count();
            $totalSelesai = $checklistBase->clone()->where('status', 'sudah')->count();
            $totalBelum = $totalTugas - $totalSelesai;

            $petugasChecklist = User::where('role', 'petugas')
                ->whereNotNull('nip')
                ->where('nip', '!=', '')
                ->get()
                ->map(function ($petugas) use ($checklistBase) {
                    $stats = $checklistBase->clone()
                        ->where('nip', $petugas->nip)
                        ->selectRaw('COUNT(*) as total, SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as selesai', ['sudah'])
                        ->first();

                    return [
                        'name' => $petugas->name,
                        'nip' => $petugas->nip,
                        'total' => (int) ($stats->total ?? 0),
                        'selesai' => (int) ($stats->selesai ?? 0),
                        'belum' => (int) (($stats->total ?? 0) - ($stats->selesai ?? 0)),
                    ];
                })
                ->filter(fn ($p) => $p['total'] > 0)
                ->values();

            $checklistStats = [
                'total' => $totalTugas,
                'selesai' => $totalSelesai,
                'belum' => $totalBelum,
                'petugas' => $petugasChecklist,
            ];
        }

        $petugasList = User::where('role', 'petugas')
            ->whereNotNull('nip')
            ->where('nip', '!=', '')
            ->get(['id', 'name', 'nip']);

        return Inertia::render('admin/dashboard', [
            'dataDasar' => $dataDasar,
            'rincianArea' => OptionHelper::get('rincian_area', []),
            'penimbanganByArea' => $penimbanganByArea,
            'pilahByJenis' => $pilahByJenis,
            'distribusiByTujuan' => $distribusiByTujuan,
            'petugasStats' => $petugasStats,
            'statusBerat' => $statusBerat,
            'siapDidistribusikanByJenis' => $siapDidistribusikanByJenis,
            'checklistStats' => $checklistStats,
            'progress' => $progress,
            'progressPetugasNip' => $progressPetugasNip,
            'progressDate' => $progressDate ?: $ref->toDateString(),
            'petugasList' => $petugasList,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }
}
