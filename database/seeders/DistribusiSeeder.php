<?php

namespace Database\Seeders;

use App\Models\Distribusi;
use Illuminate\Database\Seeder;

class DistribusiSeeder extends Seeder
{
    public function run(): void
    {
        $names = ['Budi Santoso', 'Siti Rahayu', 'Andi Pratama', 'Dewi Lestari', 'Rizki Ramadhan'];
        $jenisSampah = ['organik', 'anorganik', 'B3'];
        $tujuan = ['bank sampah', 'pengepul', 'daur ulang'];
        $lokasi = ['Bandung', 'Jakarta', 'Surabaya', 'Semarang', 'Yogyakarta', 'Malang', 'Bogor', 'Depok'];

        for ($i = 0; $i < 20; $i++) {
            Distribusi::create([
                'nama' => fake()->randomElement($names),
                'tanggal' => fake()->dateTimeBetween('-3 months', 'now'),
                'berat' => fake()->randomFloat(2, 5, 90),
                'jenis_sampah' => fake()->randomElement($jenisSampah),
                'tujuan_distribusi' => fake()->randomElement($tujuan),
                'lokasi' => fake()->randomElement($lokasi),
            ]);
        }
    }
}
