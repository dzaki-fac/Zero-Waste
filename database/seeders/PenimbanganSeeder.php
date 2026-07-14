<?php

namespace Database\Seeders;

use App\Models\Penimbangan;
use Illuminate\Database\Seeder;

class PenimbanganSeeder extends Seeder
{
    public function run(): void
    {
        $names = ['Budi Santoso', 'Siti Rahayu', 'Andi Pratama', 'Dewi Lestari', 'Rizki Ramadhan'];

        $areas = ['Utara', 'Selatan', 'Timur', 'Barat'];
        $subAreas = [
            'Jl. Merdeka', 'Jl. Pahlawan', 'Jl. Sudirman', 'Jl. Thamrin',
            'Jl. Asia Afrika', 'Jl. Gatot Subroto', 'Jl. Diponegoro',
            'Jl. Ahmad Yani', 'Jl. Imam Bonjol', 'Jl. Kartini',
        ];

        for ($i = 0; $i < 20; $i++) {
            Penimbangan::create([
                'nama' => fake()->randomElement($names),
                'tanggal' => fake()->dateTimeBetween('-3 months', 'now'),
                'berat_sampah' => fake()->randomFloat(2, 2, 85),
                'area' => fake()->randomElement($areas),
                'sub_area' => fake()->randomElement($subAreas),
            ]);
        }
    }
}
