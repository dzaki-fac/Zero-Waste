<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('checklist_pekerjaan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('petugas_id')->constrained('users')->cascadeOnDelete();
            $table->date('tanggal');
            $table->string('tugas');
            $table->enum('status', ['sudah', 'belum'])->default('belum');
            $table->timestamps();

            $table->unique(['petugas_id', 'tanggal', 'tugas']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('checklist_pekerjaan');
    }
};
