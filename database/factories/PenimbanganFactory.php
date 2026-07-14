<?php

namespace Database\Factories;

use App\Models\Penimbangan;
use Illuminate\Database\Eloquent\Factories\Factory;

class PenimbanganFactory extends Factory
{
    protected $model = Penimbangan::class;

    public function definition(): array
    {
        return [
            'nama' => fake()->name(),
            'tanggal' => fake()->dateTimeBetween('-6 months', 'now'),
            'berat_sampah' => fake()->randomFloat(2, 1, 100),
            'area' => fake()->randomElement(['Utara', 'Selatan', 'Timur', 'Barat']),
            'sub_area' => fake()->streetName(),
        ];
    }
}
