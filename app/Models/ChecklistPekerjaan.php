<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChecklistPekerjaan extends Model
{
    protected $table = 'checklist_pekerjaan';

    protected $fillable = [
        'nip',
        'tanggal',
        'tugas',
        'area',
        'status',
        'jenis_pekerjaan',
        'master_pekerjaan_id',
    ];

    protected function casts(): array
    {
        return [
            'tanggal' => 'date',
        ];
    }

    public function petugas(): BelongsTo
    {
        return $this->belongsTo(User::class, 'nip', 'nip');
    }

    public function masterPekerjaan(): BelongsTo
    {
        return $this->belongsTo(MasterPekerjaan::class);
    }
}
