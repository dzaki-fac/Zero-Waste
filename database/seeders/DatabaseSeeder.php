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
        User::factory()->admin()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'nip' => '111111111111111111',
        ]);

        User::factory()->count(5)->petugas()->create();

        $this->call([
            PenimbanganSeeder::class,
            PilahSampahSeeder::class,
            DistribusiSeeder::class,
        ]);
    }
}
