<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('checklist_pekerjaan', function (Blueprint $table) {
            $table->id();
            $table->string('nip', 30);
            $table->date('tanggal');
            $table->string('tugas');
            $table->string('area')->nullable();
            $table->string('jenis_pekerjaan', 20);
            $table->foreignId('master_pekerjaan_id')->nullable()->constrained('master_pekerjaan')->nullOnDelete();
            $table->enum('status', ['sudah', 'belum'])->default('belum');
            $table->timestamps();

            $table->unique(['nip', 'tanggal', 'master_pekerjaan_id', 'area'], 'checklist_pekerjaan_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('checklist_pekerjaan');
    }
};
