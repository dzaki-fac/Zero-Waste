<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'tanggal' => 'date',
        'berat' => 'decimal:2',
    ];
}
