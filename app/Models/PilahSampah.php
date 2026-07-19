<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @use HasFactory<\Database\Factories\PilahSampahFactory>
 */
class PilahSampah extends Model
{
    use HasFactory;

    protected $table = 'pilah_sampah';

    protected $fillable = [
        'nama',
        'tanggal',
        'area',
        'berat',
        'jenis_sampah',
        'subjenis_sampah',
        'user_id',
    ];

    protected $casts = [
        'tanggal' => 'datetime',
        'berat' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeVisibleTo($query, User $user)
    {
        if ($user->role === 'petugas') {
            return $query->where('user_id', $user->id);
        }

        return $query;
    }
}
