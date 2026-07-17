<?php

namespace Database\Seeders;

use App\Helpers\OptionHelper;
use Illuminate\Database\Seeder;

class KelolaDataSeeder extends Seeder
{
    public function run(): void
    {
        OptionHelper::save([
            'area' => [
                'Lantai 1', 'Lantai 2', 'Lantai 3', 'Lantai 4',
                'Area Teras', 'Area Halaman', 'Area Parkir',
                'UNDIP Press',
            ],
            'jenis_sampah' => [
                'Daun', 'Ranting besar', 'Ranting kecil', 'Sisa makanan',
                'Plastik berwarna', 'Plastik putih', 'Styrofoam', 'Botol',
                'Kardus dan Kertas', 'B3', 'Lainnya',
            ],
            'tujuan_distribusi' => [
                'TPS', 'Pupuk/kompos', 'PlasticPay', 'Tujuan lainnya',
            ],
        ]);
    }
}
