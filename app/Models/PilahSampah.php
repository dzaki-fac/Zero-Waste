<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PilahSampah extends Model
{
    /**
     * @use HasFactory<\Database\Factories\PilahSampahFactory>
     */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tanggal',
        'berat',
        'jenis_sampah',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'berat' => 'decimal:2',
    ];

    /**
     * @return BelongsTo<User, PilahSampah>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}