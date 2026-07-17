<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('distribusi', function (Blueprint $table) {
            $table->string('jenis_sampah')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('distribusi', function (Blueprint $table) {
            $table->string('jenis_sampah')->nullable(false)->change();
        });
    }
};
