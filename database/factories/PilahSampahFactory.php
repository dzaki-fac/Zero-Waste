<?php

namespace Database\Factories;

use App\Models\PilahSampah;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PilahSampah>
 */
class PilahSampahFactory extends Factory
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
        ];
    }
}