<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterPekerjaan extends Model
{
    protected $table = 'master_pekerjaan';

    protected $fillable = [
        'nama_pekerjaan',
        'jenis_pekerjaan',
        'urutan',
        'is_active',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('urutan');
    }
}
