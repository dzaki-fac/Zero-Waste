<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
    ];

    protected $casts = [
        'tanggal' => 'datetime',
        'berat' => 'decimal:2',
    ];
}
