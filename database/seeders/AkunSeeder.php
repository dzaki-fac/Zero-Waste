<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AkunSeeder extends Seeder
{
    public function run(): void
    {
        User::whereIn('email', [
            'admin@example.com',
            'petugas1@example.com',
            'petugas2@example.com',
            'petugas3@example.com',
            'petugas4@example.com',
            'petugas5@example.com',
        ])->delete();

        $accounts = [
            [
                'name' => 'Suwondo, S.Hum., M.Kom.',
                'email' => 'suwondo@perpus.undip',
                'nip' => '197607182001121001',
                'role' => 'admin',
                'password' => Hash::make('12345678s'),
            ],
            [
                'name' => 'Linda Wahyuningsih, S.I.Kom., M.I.Kom.',
                'email' => 'linda@perpus.undip',
                'nip' => 'H.7.198408092021042001',
                'role' => 'admin',
                'password' => Hash::make('12345678l'),
            ],
            [
                'name' => 'Partini',
                'email' => 'partini@perpus.undip',
                'nip' => 'H.7.197408232022102001',
                'role' => 'petugas',
                'password' => Hash::make('12345678p'),
            ],
            [
                'name' => 'Nasto',
                'email' => 'nasto@perpus.undip',
                'nip' => 'H.7.198001102021101001',
                'role' => 'petugas',
                'password' => Hash::make('12345678n'),
            ],
            [
                'name' => 'Kasnawi',
                'email' => 'kasnawi@perpus.undip',
                'nip' => 'H.7.197709082022101001',
                'role' => 'petugas',
                'password' => Hash::make('12345678k'),
            ],
            [
                'name' => 'Heri Dwi Pramianto',
                'email' => 'heri@perpus.undip',
                'nip' => 'H.7.198104302022101001',
                'role' => 'petugas',
                'password' => Hash::make('12345678h'),
            ],
        ];

        foreach ($accounts as $account) {
            User::updateOrCreate(
                ['email' => $account['email']],
                $account,
            );
        }
    }
}
