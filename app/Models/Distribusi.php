<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'tanggal' => 'date',
        'berat' => 'decimal:2',
    ];
}
