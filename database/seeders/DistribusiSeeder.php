<?php

namespace Database\Seeders;

use App\Models\Distribusi;
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
