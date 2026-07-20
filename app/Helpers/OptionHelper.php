<?php

namespace App\Helpers;

use App\Models\KelolaData;

class OptionHelper
{
    private static function defaults(): array
    {
        return [
            'area' => [
                'Lantai 1', 'Lantai 2', 'Lantai 3', 'Lantai 4',
                'Area Teras', 'Area Halaman & Parkir', 'UNDIP Press',
            ],
            'jenis_sampah' => [
                'Daun', 'Ranting besar', 'Ranting kecil', 'Sisa makanan',
                'Plastik berwarna', 'Plastik putih', 'Styrofoam', 'Botol',
                'Kardus dan Kertas', 'B3', 'Lainnya',
            ],
            'jenis_detail' => [
                'Daun', 'Ranting besar', 'Ranting kecil', 'Sisa makanan',
                'Plastik berwarna', 'Plastik putih', 'Styrofoam', 'Kardus',
                'Kertas', 'B3', 'Wadah', 'Botol', 'Tisu',
            ],
            'tujuan_distribusi' => [
                'TPS', 'Pupuk/kompos', 'PlasticPay', 'Tujuan lainnya',
            ],
            'rincian_area' => [
                ['nama' => 'Lantai 1', 'deskripsi' => 'Ruang baca utama, lobby, dan area administrasi', 'luas' => 1200],
                ['nama' => 'Lantai 2', 'deskripsi' => 'Ruang koleksi, sirkulasi, dan ruang diskusi', 'luas' => 1200],
                ['nama' => 'Lantai 3', 'deskripsi' => 'Ruang referensi, jurnal, dan ruang baca tenang', 'luas' => 1200],
                ['nama' => 'Lantai 4', 'deskripsi' => 'Ruang audio visual, ruang rapat, dan multimedia', 'luas' => 1000],
                ['nama' => 'Area Teras', 'deskripsi' => 'Teras depan dan belakang gedung', 'luas' => 300],
                ['nama' => 'Area Halaman & Parkir', 'deskripsi' => 'Halaman, taman, area penghijauan, dan parkir kendaraan', 'luas' => 3300],
                ['nama' => 'UNDIP Press', 'deskripsi' => 'Kantor penerbitan UNDIP Press', 'luas' => 300],
            ],
        ];
    }

    public static function all(): array
    {
        $rows = KelolaData::all()->keyBy('key');

        if ($rows->isNotEmpty()) {
            return $rows->map(fn ($r) => $r->value)->toArray();
        }

        return self::defaults();
    }

    public static function get(string $key, mixed $default = []): mixed
    {
        return self::all()[$key] ?? $default;
    }

    public static function save(array $data): void
    {
        foreach ($data as $key => $value) {
            KelolaData::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
