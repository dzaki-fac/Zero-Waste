<?php

namespace Database\Seeders;

use App\Models\Penimbangan;
use Illuminate\Database\Seeder;

class PenimbanganSeeder extends Seeder
{
    public function run(): void
    {
        $names = ['Budi Santoso', 'Siti Rahayu', 'Andi Pratama', 'Dewi Lestari', 'Rizki Ramadhan'];

        $areas = ['Lantai 1', 'Lantai 2', 'Lantai 3', 'Lantai 4', 'Area Teras', 'Area Halaman', 'Area Parkir'];
        $subAreas = ['Area Baca', 'Area Kantor', 'Area Pertemuan', 'Kamar Kecil'];

        for ($i = 0; $i < 20; $i++) {
            $area = fake()->randomElement($areas);

            Penimbangan::create([
                'nama' => fake()->randomElement($names),
                'tanggal' => fake()->dateTimeBetween('-3 months', 'now'),
                'berat_sampah' => fake()->randomFloat(2, 2, 85),
                'area' => $area,
                'sub_area' => str_starts_with($area, 'Lantai') ? fake()->randomElement($subAreas) : '-',
            ]);
        }
    }
}
