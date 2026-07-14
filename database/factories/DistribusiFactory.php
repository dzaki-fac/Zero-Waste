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
            'jenis_sampah' => fake()->randomElement(['organik', 'anorganik', 'B3']),
            'tujuan_distribusi' => fake()->randomElement(['bank sampah', 'pengepul', 'daur ulang']),
            'lokasi' => fake()->city(),
        ];
    }
}
