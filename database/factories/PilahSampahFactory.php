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
            'berat' => fake()->randomFloat(2, 1, 100),
            'jenis_sampah' => fake()->randomElement(['organik', 'anorganik', 'B3']),
        ];
    }
}
