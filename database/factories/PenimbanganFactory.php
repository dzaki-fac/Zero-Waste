<?php

namespace Database\Factories;

use App\Models\Penimbangan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Penimbangan>
 */
class PenimbanganFactory extends Factory
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
            'berat_sampah' => fake()->randomFloat(2, 1, 100),
            'area' => fake()->randomElement(['Utara', 'Selatan', 'Timur', 'Barat']),
            'sub_area' => fake()->streetName(),
        ];
    }
}