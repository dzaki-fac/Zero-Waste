<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AkunSeeder::class,
            PenimbanganSeeder::class,
            PilahSampahSeeder::class,
            DistribusiSeeder::class,
            KelolaDataSeeder::class,
        ]);
    }
}
