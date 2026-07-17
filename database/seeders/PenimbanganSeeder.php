<?php

namespace Database\Seeders;

use App\Models\Penimbangan;
use App\Models\User;
use Illuminate\Database\Seeder;

class PenimbanganSeeder extends Seeder
{
    public function run(): void
    {
        $petugas = User::where('role', 'petugas')->get()->keyBy('name');
        $areas = ['Lantai 1', 'Lantai 2', 'Lantai 3', 'Lantai 4', 'Area Teras', 'Area Halaman', 'Area Parkir'];
        $jenisSampah = [
            'Plastik Kresek & Bungkus', 'Sampah Tisu', 'Kaleng & Botol Kaca',
            'Sisa Makanan', 'Plastik Botol & Wadah', 'Styrofoam', 'Daun', 'Ranting',
        ];

        $raw = [];
        for ($i = 0; $i < 20; $i++) {
            $raw[] = fake()->randomFloat(2, 2, 85);
        }
        $total = array_sum($raw);
        $scale = $total > 0 ? 800 / $total : 1;
        $weights = array_map(fn ($w) => round($w * $scale, 2), $raw);

        for ($i = 0; $i < 20; $i++) {
            $area = fake()->randomElement($areas);
            $petugasName = fake()->randomElement($petugas->keys()->toArray());
            $petugasUser = $petugas[$petugasName];

            Penimbangan::create([
                'nama' => $petugasName,
                'user_id' => $petugasUser->id,
                'tanggal' => fake()->dateTimeBetween('-3 months', 'now'),
                'berat_sampah' => $weights[$i],
                'jenis_sampah' => fake()->randomElement($jenisSampah),
                'area' => $area,
            ]);
        }
    }
}
