<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('penimbangan', function (Blueprint $table) {
            if (!Schema::hasColumn('penimbangan', 'subjenis_sampah')) {
                $table->string('subjenis_sampah')->nullable()->after('berat_sampah');
            }
            if (!Schema::hasColumn('penimbangan', 'jenis_sampah')) {
                $table->string('jenis_sampah')->nullable()->after('subjenis_sampah');
            }
            $table->string('area')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('penimbangan', function (Blueprint $table) {
            if (Schema::hasColumn('penimbangan', 'subjenis_sampah') && Schema::hasColumn('penimbangan', 'jenis_sampah')) {
                $table->dropColumn(['subjenis_sampah', 'jenis_sampah']);
            }
            $table->string('area')->nullable(false)->change();
        });
    }
};
