<?php

namespace Database\Seeders;

use App\Models\PilahSampah;
use Illuminate\Database\Seeder;

class PilahSampahSeeder extends Seeder
{
    public function run(): void
    {
        $names = ['Budi Santoso', 'Siti Rahayu', 'Andi Pratama', 'Dewi Lestari', 'Rizki Ramadhan'];
        $jenisSampah = ['organik', 'anorganik', 'B3'];

        for ($i = 0; $i < 20; $i++) {
            PilahSampah::create([
                'nama' => fake()->randomElement($names),
                'tanggal' => fake()->dateTimeBetween('-3 months', 'now'),
                'berat' => fake()->randomFloat(2, 1, 60),
                'jenis_sampah' => fake()->randomElement($jenisSampah),
            ]);
        }
    }
}
