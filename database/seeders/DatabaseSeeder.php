<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
<<<<<<< HEAD
        // User::factory(10)->create();

        User::factory()->admin()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'nip' => '111111111111111111',
        ]);

        User::factory()->count(5)->petugas()->create();
=======
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $this->call([
            PenimbanganSeeder::class,
            PilahSampahSeeder::class,
            DistribusiSeeder::class,
        ]);
>>>>>>> main
    }
}
