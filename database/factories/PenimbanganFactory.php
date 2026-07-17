<?php

namespace Database\Factories;

use App\Models\Penimbangan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Penimbangan>
 */
class PenimbanganFactory extends Factory
{
    protected $model = Penimbangan::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $area = fake()->randomElement([
            'Lantai 1', 'Lantai 2', 'Lantai 3', 'Lantai 4',
            'Area Teras', 'Area Halaman', 'Area Parkir',
        ]);

        return [
            'nama' => fake()->name(),
            'tanggal' => fake()->dateTimeBetween('-6 months', 'now'),
            'berat_sampah' => fake()->randomFloat(2, 1, 100),
            'area' => $area,
        ];
    }
}
