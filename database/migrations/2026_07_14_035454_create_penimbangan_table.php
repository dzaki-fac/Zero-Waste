<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('penimbangan', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->dateTime('tanggal');
            $table->decimal('berat_sampah', 10, 2);
            $table->string('area');
            $table->string('sub_area');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penimbangan');
    }
};
