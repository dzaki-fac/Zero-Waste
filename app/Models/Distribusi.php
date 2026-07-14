<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Distribusi extends Model
{
    /**
     * @use HasFactory<\Database\Factories\DistribusiFactory>
     */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tanggal',
        'berat',
        'jenis_sampah',
        'tujuan_distribusi',
        'lokasi',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'berat' => 'decimal:2',
    ];

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}