<?php

namespace App\Http\Controllers;

use App\Helpers\OptionHelper;
use App\Models\ChecklistPekerjaan;
use App\Models\MasterPekerjaan;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ChecklistPekerjaanController extends Controller
{
    public function index(): Response
    {
        $petugas = User::where('role', 'petugas')->get(['id', 'name', 'nip']);

        return Inertia::render('checklist-pekerjaan/index', [
            'petugas' => $petugas,
        ]);
    }

    public function show(string $nip, Request $request): Response
    {
        $petugas = User::where('role', 'petugas')->where('nip', $nip)->firstOrFail();
        $tanggal = $request->query('tanggal', now()->toDateString());

        $filter = $request->query('jenis');
        if ($filter && !in_array($filter, ['harian', 'mingguan', 'bulanan'])) {
            $filter = null;
        }

        $areaFilter = $request->query('area');

        $masterTasks = MasterPekerjaan::active()->ordered()->get();

        $checklist = $areaFilter
            ? ChecklistPekerjaan::where('nip', $nip)
                ->where('tanggal', $tanggal)
                ->where('area', $areaFilter)
                ->get()
                ->keyBy('master_pekerjaan_id')
            : collect();

        $areas = OptionHelper::get('area');

        return Inertia::render('checklist-pekerjaan/show', [
            'petugas' => $petugas,
            'tanggal' => $tanggal,
            'masterTasks' => $masterTasks,
            'checklist' => $checklist,
            'filter' => $filter,
            'areaFilter' => $areaFilter,
            'areas' => $areas,
        ]);
    }

    public function history(string $nip, Request $request): Response
    {
        $petugas = User::where('role', 'petugas')->where('nip', $nip)->firstOrFail();

        $query = ChecklistPekerjaan::where('nip', $nip);

        if ($request->query('start_date')) {
            $query->where('tanggal', '>=', $request->query('start_date'));
        }

        if ($request->query('end_date')) {
            $query->where('tanggal', '<=', $request->query('end_date'));
        }

        if ($request->query('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->query('area')) {
            $query->where('area', $request->query('area'));
        }

        $records = $query->orderBy('tanggal', 'desc')
            ->orderBy('id')
            ->get()
            ->groupBy('tanggal')
            ->map(function ($items, $tanggal) {
                $total = $items->count();
                $selesai = $items->where('status', 'sudah')->count();

                return [
                    'tanggal' => $tanggal,
                    'total' => $total,
                    'selesai' => $selesai,
                    'belum' => $total - $selesai,
                ];
            })
            ->values();

        return Inertia::render('checklist-pekerjaan/history', [
            'petugas' => $petugas,
            'records' => $records,
        ]);
    }

    public function export(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $nip = $request->query('nip');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $status = $request->query('status');
        $area = $request->query('area');

        $petugas = User::where('role', 'petugas')->where('nip', $nip)->firstOrFail();

        $query = ChecklistPekerjaan::where('nip', $nip);

        if ($startDate) {
            $query->where('tanggal', '>=', $startDate);
        }

        if ($endDate) {
            $query->where('tanggal', '<=', $endDate);
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($area) {
            $query->where('checklist_pekerjaan.area', $area);
        }

        $rows = $query->join('master_pekerjaan', 'checklist_pekerjaan.master_pekerjaan_id', '=', 'master_pekerjaan.id')
            ->select('checklist_pekerjaan.*')
            ->orderBy('tanggal', 'desc')
            ->orderBy('master_pekerjaan.urutan')
            ->get();

        $filename = 'checklist_' . str_replace(' ', '_', $petugas->name) . '_' . $petugas->nip . '_' . now()->toDateString() . '.csv';

        $headers = ['No', 'Tanggal', 'Area', 'Jenis Pekerjaan', 'Tugas', 'Status', 'Dibuat Pada', 'Diperbarui Pada'];

        $callback = function () use ($rows, $headers) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));
            fputcsv($file, $headers);

            $index = 1;
            foreach ($rows as $row) {
                fputcsv($file, [
                    $index++,
                    $row->tanggal,
                    $row->area ?? 'Belum ditentukan',
                    ucfirst($row->jenis_pekerjaan),
                    $row->tugas,
                    $row->status === 'sudah' ? 'Sudah' : 'Belum',
                    $row->created_at,
                    $row->updated_at,
                ]);
            }

            fclose($file);
        };

        return response()->streamDownload($callback, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    public function exportAll(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $nip = $request->query('nip');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $status = $request->query('status');
        $area = $request->query('area');

        $query = ChecklistPekerjaan::join('users', 'users.nip', '=', 'checklist_pekerjaan.nip')
            ->join('master_pekerjaan', 'checklist_pekerjaan.master_pekerjaan_id', '=', 'master_pekerjaan.id')
            ->select('checklist_pekerjaan.*', 'users.name as nama_petugas');

        if ($nip) {
            $query->where('checklist_pekerjaan.nip', $nip);
        }

        if ($startDate) {
            $query->where('tanggal', '>=', $startDate);
        }

        if ($endDate) {
            $query->where('tanggal', '<=', $endDate);
        }

        if ($status) {
            $query->where('checklist_pekerjaan.status', $status);
        }

        if ($area) {
            $query->where('checklist_pekerjaan.area', $area);
        }

        $rows = $query->orderBy('tanggal', 'desc')
            ->orderBy('users.name')
            ->orderBy('master_pekerjaan.urutan')
            ->get();

        if ($startDate && $endDate) {
            $filename = 'checklist_semua_petugas_' . $startDate . '_' . $endDate . '.csv';
        } else {
            $filename = 'checklist_semua_petugas_' . now()->toDateString() . '.csv';
        }

        $headers = ['No', 'Nama Petugas', 'NIP', 'Tanggal', 'Area', 'Jenis Pekerjaan', 'Tugas', 'Status', 'Dibuat Pada', 'Diperbarui Pada'];

        $callback = function () use ($rows, $headers) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF) . chr(0xBB) . chr(0xBF));
            fputcsv($file, $headers);

            $index = 1;
            foreach ($rows as $row) {
                fputcsv($file, [
                    $index++,
                    $row->nama_petugas,
                    "\t" . $row->nip,
                    $row->tanggal,
                    $row->area ?? 'Belum ditentukan',
                    ucfirst($row->jenis_pekerjaan),
                    $row->tugas,
                    $row->status === 'sudah' ? 'Sudah' : 'Belum',
                    $row->created_at,
                    $row->updated_at,
                ]);
            }

            fclose($file);
        };

        return response()->streamDownload($callback, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nip' => ['required', 'exists:users,nip'],
            'tanggal' => ['required', 'date'],
            'area' => ['required', 'string', 'max:255'],
            'items' => ['required', 'array'],
            'items.*.master_pekerjaan_id' => ['required', 'exists:master_pekerjaan,id'],
            'items.*.status' => ['required', 'in:sudah,belum'],
        ]);

        $petugas = User::where('role', 'petugas')->where('nip', $validated['nip'])->firstOrFail();

        $masterIds = collect($validated['items'])->pluck('master_pekerjaan_id')->unique();
        $masterTasks = MasterPekerjaan::whereIn('id', $masterIds)->get()->keyBy('id');

        $area = $validated['area'];
        $now = now();

        $existingRecords = ChecklistPekerjaan::where('nip', $petugas->nip)
            ->where('tanggal', $validated['tanggal'])
            ->where('area', $area)
            ->get()
            ->keyBy('master_pekerjaan_id');

        ChecklistPekerjaan::where('nip', $petugas->nip)
            ->where('tanggal', $validated['tanggal'])
            ->where('area', $area)
            ->delete();

        $rows = array_map(fn ($item) => [
            'nip' => $petugas->nip,
            'tanggal' => $validated['tanggal'],
            'master_pekerjaan_id' => $item['master_pekerjaan_id'],
            'tugas' => $masterTasks[$item['master_pekerjaan_id']]->nama_pekerjaan,
            'area' => $area,
            'jenis_pekerjaan' => $masterTasks[$item['master_pekerjaan_id']]->jenis_pekerjaan,
            'status' => $item['status'],
            'created_at' => $existingRecords[$item['master_pekerjaan_id']]->created_at ?? $now,
            'updated_at' => $now,
        ], $validated['items']);

        ChecklistPekerjaan::insert($rows);

        return to_route('admin.checklist-pekerjaan.index');
    }
}
