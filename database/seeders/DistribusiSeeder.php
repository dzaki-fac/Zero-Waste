<?php

namespace Database\Seeders;

use App\Models\Distribusi;
use App\Models\PilahSampah;
use App\Models\User;
use Illuminate\Database\Seeder;

class DistribusiSeeder extends Seeder
{
    public function run(): void
    {
        $names = User::pluck('name')->toArray();
        $jenisSampah = [
            'Daun', 'Ranting besar', 'Ranting kecil', 'Sisa makanan',
            'Plastik berwarna', 'Plastik putih', 'Styrofoam', 'Botol',
            'Kardus dan Kertas', 'B3', 'Lainnya',
        ];
        $tujuan = ['TPS', 'Pupuk/kompos', 'PlasticPay', 'Tujuan lainnya'];
        $lokasi = ['Bandung', 'Jakarta', 'Surabaya', 'Semarang', 'Yogyakarta', 'Malang', 'Bogor', 'Depok'];

        $totalPilah = (float) PilahSampah::sum('berat');
        $targetTotal = round($totalPilah * fake()->randomFloat(2, 0.50, 0.70), 2);

        $raw = [];
        for ($i = 0; $i < 20; $i++) {
            $raw[] = fake()->randomFloat(2, 1, 25);
        }
        $currentTotal = array_sum($raw);
        $scale = $currentTotal > 0 ? $targetTotal / $currentTotal : 1;
        $weights = array_map(fn ($w) => round($w * $scale, 2), $raw);

        for ($i = 0; $i < 20; $i++) {
            Distribusi::create([
                'nama' => fake()->randomElement($names),
                'tanggal' => fake()->dateTimeBetween('-3 months', 'now'),
                'berat' => $weights[$i],
                'jenis_sampah' => fake()->randomElement($jenisSampah),
                'tujuan_distribusi' => fake()->randomElement($tujuan),
                'lokasi' => fake()->randomElement($lokasi),
            ]);
        }
    }
}
