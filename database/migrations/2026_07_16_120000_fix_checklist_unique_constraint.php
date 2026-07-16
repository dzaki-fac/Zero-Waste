<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('checklist_pekerjaan', function (Blueprint $table) {
            $table->dropUnique('checklist_pekerjaan_nip_tanggal_tugas_unique');
        });

        $this->deduplicateOldRecords();

        Schema::table('checklist_pekerjaan', function (Blueprint $table) {
            $table->unique(['nip', 'tanggal', 'master_pekerjaan_id', 'area'], 'checklist_pekerjaan_unique');
        });
    }

    private function deduplicateOldRecords(): void
    {
        $duplicates = DB::table('checklist_pekerjaan')
            ->select('nip', 'tanggal', 'master_pekerjaan_id', 'area', DB::raw('MIN(id) as keep_id'))
            ->groupBy('nip', 'tanggal', 'master_pekerjaan_id', 'area')
            ->havingRaw('COUNT(*) > 1')
            ->get();

        foreach ($duplicates as $dup) {
            DB::table('checklist_pekerjaan')
                ->where('nip', $dup->nip)
                ->where('tanggal', $dup->tanggal)
                ->where('master_pekerjaan_id', $dup->master_pekerjaan_id)
                ->where(function ($q) use ($dup) {
                    if ($dup->area === null) {
                        $q->whereNull('area');
                    } else {
                        $q->where('area', $dup->area);
                    }
                })
                ->where('id', '!=', $dup->keep_id)
                ->delete();
        }
    }

    public function down(): void
    {
        Schema::table('checklist_pekerjaan', function (Blueprint $table) {
            $table->dropUnique('checklist_pekerjaan_unique');
        });

        Schema::table('checklist_pekerjaan', function (Blueprint $table) {
            $table->unique(['nip', 'tanggal', 'tugas'], 'checklist_pekerjaan_nip_tanggal_tugas_unique');
        });
    }
};
