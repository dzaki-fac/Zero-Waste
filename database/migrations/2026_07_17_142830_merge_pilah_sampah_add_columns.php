<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pilah_sampah', function (Blueprint $table) {
            if (!Schema::hasColumn('pilah_sampah', 'area')) {
                $table->string('area')->nullable()->after('tanggal');
            }
            if (!Schema::hasColumn('pilah_sampah', 'subjenis_sampah')) {
                $table->string('subjenis_sampah')->nullable()->after('jenis_sampah');
            }
            $table->string('jenis_sampah')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('pilah_sampah', function (Blueprint $table) {
            $columns = [];
            if (Schema::hasColumn('pilah_sampah', 'area')) $columns[] = 'area';
            if (Schema::hasColumn('pilah_sampah', 'subjenis_sampah')) $columns[] = 'subjenis_sampah';
            if ($columns) $table->dropColumn($columns);
            $table->string('jenis_sampah')->nullable(false)->change();
        });
    }
};
