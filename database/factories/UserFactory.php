<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'nip' => fake()->unique()->numerify(str_repeat('#', 18)),
            'role' => 'petugas',
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

<<<<<<< HEAD
    public function withTwoFactor(): static {}

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'admin',
        ]);
    }

    public function petugas(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'petugas',
        ]);
    }
}
=======
    /**
     * Indicate that the model has two-factor authentication configured.
     */
    public function withTwoFactor(): static
    {
        return $this->state(fn (array $attributes) => [
            'two_factor_secret' => encrypt(Str::random(40)),
            'two_factor_recovery_codes' => encrypt(json_encode(
                Collection::times(8, fn () => Str::random(10))->all()
            )),
            'two_factor_confirmed_at' => now(),
        ]);
    }
}
>>>>>>> main
