<?php

namespace App\Http\Controllers;

use App\Models\ChecklistPekerjaan;
use App\Models\MasterPekerjaan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class MasterPekerjaanController extends Controller
{
    public function index(Request $request): Response
    {
        $filter = $request->query('jenis');
        if ($filter && !in_array($filter, ['harian', 'mingguan', 'bulanan'])) {
            $filter = null;
        }

        $pekerjaan = MasterPekerjaan::ordered()->get();

        return Inertia::render('kelola-pekerjaan/index', [
            'pekerjaan' => $pekerjaan,
            'filter' => $filter,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_pekerjaan' => ['required', 'string', 'max:255'],
            'jenis_pekerjaan' => ['required', 'in:harian,mingguan,bulanan'],
        ]);

        DB::transaction(function () use ($validated) {
            MasterPekerjaan::create([
                'nama_pekerjaan' => $validated['nama_pekerjaan'],
                'jenis_pekerjaan' => $validated['jenis_pekerjaan'],
                'urutan' => 0,
            ]);

            $this->normalizeUrutan();
        });

        return to_route('admin.kelola-pekerjaan.index');
    }

    public function update(Request $request, MasterPekerjaan $masterPekerjaan): RedirectResponse
    {
        $validated = $request->validate([
            'nama_pekerjaan' => ['required', 'string', 'max:255'],
            'jenis_pekerjaan' => ['required', 'in:harian,mingguan,bulanan'],
        ]);

        DB::transaction(function () use ($masterPekerjaan, $validated) {
            $masterPekerjaan->update([
                'nama_pekerjaan' => $validated['nama_pekerjaan'],
                'jenis_pekerjaan' => $validated['jenis_pekerjaan'],
            ]);

            $this->normalizeUrutan();
        });

        return to_route('admin.kelola-pekerjaan.index');
    }

    public function destroy(MasterPekerjaan $masterPekerjaan): RedirectResponse
    {
        DB::transaction(function () use ($masterPekerjaan) {
            ChecklistPekerjaan::where('master_pekerjaan_id', $masterPekerjaan->id)->delete();
            $masterPekerjaan->delete();
            $this->normalizeUrutan();
        });

        return to_route('admin.kelola-pekerjaan.index');
    }

    private function normalizeUrutan(): void
    {
        $tasks = MasterPekerjaan::where('is_active', true)
            ->orderByRaw("FIELD(jenis_pekerjaan, 'harian', 'mingguan', 'bulanan')")
            ->orderByRaw("IF(urutan = 0, 999999999, urutan)")
            ->orderBy('id')
            ->get();

        $urutan = 1;
        foreach ($tasks as $task) {
            if ($task->urutan !== $urutan) {
                $task->update(['urutan' => $urutan]);
            }
            $urutan++;
        }
    }
}
