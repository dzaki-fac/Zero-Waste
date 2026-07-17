<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('checklist_pekerjaan', function (Blueprint $table) {
            $table->dropForeign(['petugas_id']);
            $table->dropUnique(['petugas_id', 'tanggal', 'tugas']);
        });

        Schema::table('checklist_pekerjaan', function (Blueprint $table) {
            $table->string('petugas_id', 30)->change();
        });

        Schema::table('checklist_pekerjaan', function (Blueprint $table) {
            $table->unique(['petugas_id', 'tanggal', 'tugas']);
        });
    }

    public function down(): void
    {
        Schema::table('checklist_pekerjaan', function (Blueprint $table) {
            $table->dropUnique(['petugas_id', 'tanggal', 'tugas']);
        });

        Schema::table('checklist_pekerjaan', function (Blueprint $table) {
            $table->foreignId('petugas_id')->constrained('users')->cascadeOnDelete()->change();
        });

        Schema::table('checklist_pekerjaan', function (Blueprint $table) {
            $table->unique(['petugas_id', 'tanggal', 'tugas']);
        });
    }
};
