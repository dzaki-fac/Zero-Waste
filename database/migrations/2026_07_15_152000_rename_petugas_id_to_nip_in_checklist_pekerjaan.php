<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('checklist_pekerjaan', function (Blueprint $table) {
            $table->dropUnique(['petugas_id', 'tanggal', 'tugas']);
            $table->renameColumn('petugas_id', 'nip');
            $table->unique(['nip', 'tanggal', 'tugas']);
        });
    }

    public function down(): void
    {
        Schema::table('checklist_pekerjaan', function (Blueprint $table) {
            $table->dropUnique(['nip', 'tanggal', 'tugas']);
            $table->renameColumn('nip', 'petugas_id');
            $table->unique(['petugas_id', 'tanggal', 'tugas']);
        });
    }
};
