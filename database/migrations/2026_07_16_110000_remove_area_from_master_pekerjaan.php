<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('master_pekerjaan', function (Blueprint $table) {
            $table->dropColumn('area');
        });

        Schema::table('checklist_pekerjaan', function (Blueprint $table) {
            if (Schema::hasIndex('checklist_pekerjaan', 'checklist_pekerjaan_area_index')) {
                $table->dropIndex('checklist_pekerjaan_area_index');
            }
        });
    }

    public function down(): void
    {
        Schema::table('master_pekerjaan', function (Blueprint $table) {
            $table->string('area')->nullable()->after('jenis_pekerjaan');
        });

        Schema::table('checklist_pekerjaan', function (Blueprint $table) {
            $table->index('area');
        });
    }
};
