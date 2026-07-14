<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\Database\Factories\DistribusiFactory>
 */
class Penimbangan extends Model
{
    use HasFactory;

    protected $table = 'penimbangan';

    protected $fillable = [
        'user_id',
        'tanggal',
        'berat_sampah',
        'area',
        'sub_area',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'berat_sampah' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
