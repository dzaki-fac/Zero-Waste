<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Penimbangan extends Model
{
    use HasFactory;

    protected $table = 'penimbangan';

    protected $fillable = [
        'nama',
        'tanggal',
        'berat_sampah',
        'area',
        'sub_area',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'berat_sampah' => 'decimal:2',
    ];
}
