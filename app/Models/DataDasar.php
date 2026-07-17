<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DataDasar extends Model
{
    protected $table = 'data_dasar';

    protected $fillable = [
        'user_id',
        'nama_tim',
        'fakultas',
        'alamat',
        'penanggung_jawab',
        'nomor_hp_email',
        'tanggal_pengisian',
        'jumlah_mahasiswa',
        'jumlah_dosen',
        'jumlah_tendik',
        'jumlah_tenaga_pendukung',
        'total_warga',
        'luas_area_fakultas',
        'luas_area_objek_lomba',
        'baseline_sampah',
        'baseline_sampah_periode',
        'jenis_sampah_dominan',
        'kondisi_fasilitas',
        'sampah_residu_akhir',
        'total_sampah_terkelola',
        'jumlah_warga_terlibat_aktif',
        'luas_area_zero_waste',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_pengisian' => 'date:Y-m-d',
            'jenis_sampah_dominan' => 'array',
            'total_warga' => 'integer',
            'jumlah_mahasiswa' => 'integer',
            'jumlah_dosen' => 'integer',
            'jumlah_tendik' => 'integer',
            'jumlah_tenaga_pendukung' => 'integer',
            'sampah_residu_akhir' => 'decimal:2',
            'total_sampah_terkelola' => 'decimal:2',
            'jumlah_warga_terlibat_aktif' => 'integer',
            'luas_area_zero_waste' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
