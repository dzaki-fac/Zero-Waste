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
            'tujuan_distribusi' => [
                'TPS', 'Pupuk/kompos', 'PlasticPay', 'Tujuan lainnya',
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
