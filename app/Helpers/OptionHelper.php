<?php

namespace App\Helpers;

use App\Models\KelolaData;

class OptionHelper
{
    private static ?array $cache = null;

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

        self::$cache = config('kelola-data');
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
