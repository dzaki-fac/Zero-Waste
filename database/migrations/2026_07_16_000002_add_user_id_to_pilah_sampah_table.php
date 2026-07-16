<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pilah_sampah', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->index('user_id');
        });

        $this->backfillUserIds();
    }

    private function backfillUserIds(): void
    {
        $records = DB::table('pilah_sampah')->whereNull('user_id')->get();
        foreach ($records as $record) {
            $user = DB::table('users')->where('name', $record->nama)->first();
            if ($user) {
                DB::table('pilah_sampah')->where('id', $record->id)->update(['user_id' => $user->id]);
            }
        }
    }

    public function down(): void
    {
        Schema::table('pilah_sampah', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};
