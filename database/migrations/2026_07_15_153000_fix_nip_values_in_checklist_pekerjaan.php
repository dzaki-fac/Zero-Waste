<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('
            UPDATE checklist_pekerjaan c
            INNER JOIN users u ON u.id = c.nip
            SET c.nip = u.nip
            WHERE u.role = ?
        ', ['petugas']);
    }

    public function down(): void
    {
        // No reliable way to reverse without snapshots
    }
};
