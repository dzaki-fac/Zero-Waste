<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('data_dasar', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('nama_tim');
            $table->string('fakultas');
            $table->text('alamat')->nullable();
            $table->string('penanggung_jawab');
            $table->string('nomor_hp_email');
            $table->date('tanggal_pengisian');
            $table->integer('jumlah_mahasiswa')->default(0);
            $table->integer('jumlah_dosen')->default(0);
            $table->integer('jumlah_tendik')->default(0);
            $table->integer('jumlah_tenaga_pendukung')->default(0);
            $table->integer('total_warga')->default(0);
            $table->decimal('luas_area_fakultas', 12, 2)->default(0);
            $table->decimal('luas_area_objek_lomba', 12, 2)->default(0);
            $table->decimal('baseline_sampah', 12, 2)->default(0);
            $table->string('baseline_sampah_periode', 10)->default('hari');
            $table->json('jenis_sampah_dominan')->nullable();
            $table->text('kondisi_fasilitas')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('data_dasar');
    }
};
