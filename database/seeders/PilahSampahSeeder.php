<?php

namespace Database\Seeders;

use App\Models\PilahSampah;
use App\Models\User;
use Illuminate\Database\Seeder;

class PilahSampahSeeder extends Seeder
{
    public function run(): void
    {
        $names = User::pluck('name')->toArray();
        $jenisSampah = [
            'Daun', 'Ranting besar', 'Ranting kecil', 'Sisa makanan',
            'Plastik berwarna', 'Plastik putih', 'Styrofoam', 'Botol',
            'Kardus dan Kertas', 'B3', 'Lainnya',
        ];

        for ($i = 0; $i < 20; $i++) {
            PilahSampah::create([
                'nama' => fake()->randomElement($names),
                'tanggal' => fake()->dateTimeBetween('-3 months', 'now'),
                'berat' => fake()->randomFloat(2, 0.5, 30),
                'jenis_sampah' => fake()->randomElement($jenisSampah),
            ]);
        }
    }
}
