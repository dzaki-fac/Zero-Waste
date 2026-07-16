<?php

namespace Database\Seeders;

use App\Helpers\OptionHelper;
use Illuminate\Database\Seeder;

class KelolaDataSeeder extends Seeder
{
    public function run(): void
    {
        OptionHelper::save(config('kelola-data'));
    }
}
