<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Storage;

class OptionHelper
{
    private static ?array $cache = null;

    public static function all(): array
    {
        if (self::$cache !== null) {
            return self::$cache;
        }

        $path = Storage::disk('local')->path('settings/options.json');

        if (file_exists($path)) {
            $data = json_decode(file_get_contents($path), true);
            if (is_array($data)) {
                self::$cache = $data;
                return self::$cache;
            }
        }

        self::$cache = config('options');
        return self::$cache;
    }

    public static function get(string $key, mixed $default = []): mixed
    {
        return self::all()[$key] ?? $default;
    }

    public static function save(array $data): void
    {
        $path = Storage::disk('local')->path('settings/options.json');
        $dir = dirname($path);

        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        self::$cache = $data;
    }

    public static function flush(): void
    {
        self::$cache = null;
    }
}
