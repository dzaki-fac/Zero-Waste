<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $records = DB::table('checklist_pekerjaan')
            ->whereNotNull('nip')
            ->get();

        foreach ($records as $record) {
            $user = DB::table('users')->where('id', $record->nip)->where('role', 'petugas')->first();
            if ($user && $user->nip) {
                DB::table('checklist_pekerjaan')
                    ->where('id', $record->id)
                    ->update(['nip' => $user->nip]);
            }
        }
    }

    public function down(): void
    {
        // No reliable way to reverse without snapshots
    }
};
