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
        Schema::table('penimbangan', function (Blueprint $table) {
            $table->string('sub_area')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('penimbangan', function (Blueprint $table) {
            $table->string('sub_area')->nullable(false)->change();
        });
    }
};
