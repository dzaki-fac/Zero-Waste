<?php

namespace App\Helpers;

use App\Models\KelolaData;

class OptionHelper
{
    private static ?array $cache = null;

    private static function defaults(): array
    {
        return [
            'area' => [
                'Lantai 1', 'Lantai 2', 'Lantai 3', 'Lantai 4',
                'Area Teras', 'Area Halaman', 'Area Parkir',
            ],
            'jenis_sampah' => [
                'Daun', 'Ranting besar', 'Ranting kecil', 'Sisa makanan',
                'Plastik berwarna', 'Plastik putih', 'Styrofoam', 'Botol',
                'Kardus dan Kertas', 'B3', 'Lainnya',
            ],
            'subjenis_sampah' => [
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
                ['nama' => 'Area Halaman', 'deskripsi' => 'Halaman, taman, dan area penghijauan', 'luas' => 1800],
                ['nama' => 'Area Parkir', 'deskripsi' => 'Area parkir kendaraan roda dua dan roda empat', 'luas' => 1500],
                ['nama' => 'UNDIP Press', 'deskripsi' => 'Kantor penerbitan UNDIP Press', 'luas' => 300],
            ],
        ];
    }

    public static function all(): array
    {
        if (self::$cache !== null) {
            return self::$cache;
        }

        $rows = KelolaData::all()->keyBy('key');

        if ($rows->isNotEmpty()) {
            self::$cache = $rows->map(fn ($r) => $r->value)->toArray();
            return self::$cache;
        }

        self::$cache = self::defaults();
        return self::$cache;
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
        self::$cache = $data;
    }

    public static function flush(): void
    {
        self::$cache = null;
    }
}
