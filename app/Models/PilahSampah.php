<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'berat',
        'jenis_sampah',
    ];

    protected $casts = [
        'tanggal' => 'datetime',
        'berat' => 'decimal:2',
    ];
}
