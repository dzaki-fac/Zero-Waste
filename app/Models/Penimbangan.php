<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @use HasFactory<\Database\Factories\PenimbanganFactory>
 */
class Penimbangan extends Model
{
    use HasFactory;

    protected $table = 'penimbangan';

    protected $fillable = [
        'nama',
        'tanggal',
        'berat_sampah',
        'subjenis_sampah',
        'jenis_sampah',
        'area',
        'user_id',
    ];

    protected $casts = [
        'tanggal' => 'datetime',
        'berat_sampah' => 'decimal:2',
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
