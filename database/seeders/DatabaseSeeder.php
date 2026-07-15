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
            'nip' => '111111111111111110',
        ]);

        foreach (range(1, 5) as $i) {
            User::factory()->petugas()->create([
                'name' => "Petugas $i",
                'email' => "petugas{$i}@example.com",
                'nip' => "11111111111111111{$i}",
                'password' => bcrypt('petugas123'),
            ]);
        }

        $this->call([
            PenimbanganSeeder::class,
            PilahSampahSeeder::class,
            DistribusiSeeder::class,
        ]);
    }
}
