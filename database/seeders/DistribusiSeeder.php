<?php

namespace Database\Seeders;

use App\Models\Distribusi;
use App\Models\PilahSampah;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DistribusiSeeder extends Seeder
{
    public function run(): void
    {
        $names = User::pluck('name')->toArray();
        $tujuan = ['TPS', 'Pupuk/kompos', 'PlasticPay', 'Tujuan lainnya'];
        $lokasi = ['Bandung', 'Jakarta', 'Surabaya', 'Semarang', 'Yogyakarta', 'Malang', 'Bogor', 'Depok'];

        $pilahByJenis = PilahSampah::select('jenis_sampah', DB::raw('SUM(berat) as total'))
            ->groupBy('jenis_sampah')
            ->pluck('total', 'jenis_sampah');

        foreach ($pilahByJenis as $jenis => $totalPilah) {
            $ratio = fake()->randomFloat(2, 0.50, 0.70);
            $targetDistribusi = round($totalPilah * $ratio, 2);

            $raw = [];
            for ($i = 0; $i < 5; $i++) {
                $raw[] = fake()->randomFloat(2, 1, 15);
            }
            $currentTotal = array_sum($raw);
            $scale = $currentTotal > 0 ? $targetDistribusi / $currentTotal : 1;
            $weights = array_map(fn ($w) => round($w * $scale, 2), $raw);

            foreach ($weights as $weight) {
                Distribusi::create([
                    'nama' => fake()->randomElement($names),
                    'tanggal' => fake()->dateTimeBetween('-3 months', 'now'),
                    'berat' => $weight,
                    'jenis_sampah' => $jenis,
                    'tujuan_distribusi' => fake()->randomElement($tujuan),
                    'lokasi' => fake()->randomElement($lokasi),
                ]);
            }
        }
    }
}
