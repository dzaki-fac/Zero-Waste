<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @use HasFactory<\Database\Factories\DistribusiFactory>
 */
class Distribusi extends Model
{
    use HasFactory;

    protected $table = 'distribusi';

    protected $fillable = [
        'nama',
        'tanggal',
        'berat',
        'jenis_sampah',
        'tujuan_distribusi',
        'lokasi',
        'user_id',
    ];

    protected $casts = [
        'tanggal' => 'datetime',
        'berat' => 'decimal:2',
        'reviewed_at' => 'datetime',
        'revision_submitted_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function scopeVisibleTo($query, User $user)
    {
        if ($user->role === 'petugas') {
            return $query->where('user_id', $user->id);
        }

        return $query;
    }
}
