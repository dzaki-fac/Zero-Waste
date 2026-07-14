<?php

namespace Database\Factories;

use App\Models\PilahSampah;
use Illuminate\Database\Eloquent\Factories\Factory;

class PilahSampahFactory extends Factory
{
    protected $model = PilahSampah::class;

    public function definition(): array
    {
        return [
            'nama' => fake()->name(),
            'tanggal' => fake()->dateTimeBetween('-6 months', 'now'),
            'berat' => fake()->randomFloat(2, 0.5, 50),
            'jenis_sampah' => fake()->randomElement([
                'Daun', 'Ranting besar', 'Ranting kecil', 'Sisa makanan',
                'Plastik berwarna', 'Plastik putih', 'Styrofoam', 'Botol',
                'Kardus dan Kertas', 'B3', 'Lainnya',
            ]),
        ];
    }
}
