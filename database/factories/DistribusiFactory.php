<?php

namespace Database\Factories;

use App\Models\Distribusi;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Distribusi>
 */
class DistribusiFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'tanggal' => fake()->dateTimeBetween('-6 months', 'now'),
            'berat' => fake()->randomFloat(2, 1, 100),
            'jenis_sampah' => fake()->randomElement(['organik', 'anorganik', 'B3']),
            'tujuan_distribusi' => fake()->randomElement(['bank sampah', 'pengepul', 'daur ulang']),
            'lokasi' => fake()->city(),
        ];
    }
}