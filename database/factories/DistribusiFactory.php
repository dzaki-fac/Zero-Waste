<?php

namespace Database\Factories;

use App\Models\Distribusi;
use Illuminate\Database\Eloquent\Factories\Factory;

class DistribusiFactory extends Factory
{
    protected $model = Distribusi::class;

    public function definition(): array
    {
        return [
            'nama' => fake()->name(),
            'tanggal' => fake()->dateTimeBetween('-6 months', 'now'),
            'berat' => fake()->randomFloat(2, 1, 100),
            'jenis_sampah' => fake()->randomElement([
                'Daun', 'Ranting besar', 'Ranting kecil', 'Sisa makanan',
                'Plastik berwarna', 'Plastik putih', 'Styrofoam', 'Botol',
                'Kardus dan Kertas', 'B3', 'Lainnya',
            ]),
            'tujuan_distribusi' => fake()->randomElement(['TPS', 'Pupuk/kompos', 'PlasticPay', 'Tujuan lainnya']),
            'lokasi' => fake()->city(),
        ];
    }
}
