<?php

namespace Database\Seeders;

use App\Models\PilahSampah;
use App\Models\Penimbangan;
use App\Models\User;
use Illuminate\Database\Seeder;

class PilahSampahSeeder extends Seeder
{
    public function run(): void
    {
        $petugas = User::where('role', 'petugas')->get()->keyBy('name');
        $jenisSampah = [
            'Daun', 'Ranting besar', 'Ranting kecil', 'Sisa makanan',
            'Plastik berwarna', 'Plastik putih', 'Styrofoam', 'Botol',
            'Kardus dan Kertas', 'B3', 'Lainnya',
        ];

        $totalPenimbangan = (float) Penimbangan::sum('berat_sampah');
        $targetTotal = round($totalPenimbangan * fake()->randomFloat(2, 0.60, 0.80), 2);

        $raw = [];
        for ($i = 0; $i < 20; $i++) {
            $raw[] = fake()->randomFloat(2, 0.5, 30);
        }
        $currentTotal = array_sum($raw);
        $scale = $currentTotal > 0 ? $targetTotal / $currentTotal : 1;
        $weights = array_map(fn ($w) => round($w * $scale, 2), $raw);

        for ($i = 0; $i < 20; $i++) {
            $petugasName = fake()->randomElement($petugas->keys()->toArray());
            $petugasUser = $petugas[$petugasName];

            PilahSampah::create([
                'nama' => $petugasName,
                'user_id' => $petugasUser->id,
                'tanggal' => fake()->dateTimeBetween('-3 months', 'now'),
                'berat' => $weights[$i],
                'jenis_sampah' => fake()->randomElement($jenisSampah),
            ]);
        }
    }
}
