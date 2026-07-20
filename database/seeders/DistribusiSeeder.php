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
        $petugas = User::where('role', 'petugas')->get()->keyBy('name');
        $tujuan = ['TPS', 'Pupuk/kompos', 'PlasticPay', 'Tujuan lainnya'];
        $lokasi = ['Bandung', 'Jakarta', 'Surabaya', 'Semarang', 'Yogyakarta', 'Malang', 'Bogor', 'Depok'];

        $pilahByJenis = PilahSampah::select('subjenis_sampah', DB::raw('SUM(berat) as total'))
            ->groupBy('subjenis_sampah')
            ->pluck('total', 'subjenis_sampah');

        foreach ($pilahByJenis as $subjenis => $totalPilah) {
            if (!$subjenis) continue;
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
                $petugasName = fake()->randomElement($petugas->keys()->toArray());
                $petugasUser = $petugas[$petugasName];

                Distribusi::create([
                    'nama' => $petugasName,
                    'user_id' => $petugasUser->id,
                    'tanggal' => fake()->dateTimeBetween('-3 months', 'now'),
                    'berat' => $weight,
                    'jenis_sampah' => $subjenis,
                    'tujuan_distribusi' => fake()->randomElement($tujuan),
                    'lokasi' => fake()->randomElement($lokasi),
                ]);
            }
        }
    }
}
