<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('checklist_pekerjaan', function (Blueprint $table) {
            $table->dropColumn('nama_pekerjaan_snapshot');
            $table->dropColumn('jenis_pekerjaan_snapshot');
        });
    }

    public function down(): void
    {
        Schema::table('checklist_pekerjaan', function (Blueprint $table) {
            $table->string('nama_pekerjaan_snapshot')->nullable()->after('tugas');
            $table->string('jenis_pekerjaan_snapshot', 20)->nullable()->after('nama_pekerjaan_snapshot');
        });
    }
};
