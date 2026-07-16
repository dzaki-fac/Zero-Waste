<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AkunSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'nip' => '111111111111111110',
                'password' => bcrypt('password'),
                'role' => 'admin',
            ]
        );

        foreach (range(1, 5) as $i) {
            User::firstOrCreate(
                ['email' => "petugas{$i}@example.com"],
                [
                    'name' => "Petugas $i",
                    'nip' => "11111111111111111{$i}",
                    'password' => bcrypt('petugas123'),
                    'role' => 'petugas',
                ]
            );
        }
    }
}
