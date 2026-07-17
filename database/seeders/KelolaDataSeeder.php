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
                'Plastik Kresek & Bungkus', 'Sampah Tisu', 'Kaleng & Botol Kaca',
                'Sisa Makanan', 'Plastik Botol & Wadah', 'Styrofoam', 'Daun', 'Ranting',
            ],
            'subjenis_sampah' => [
                'Daun', 'Ranting besar', 'Ranting kecil', 'Sisa makanan',
                'Plastik berwarna', 'Plastik putih', 'Styrofoam', 'Kardus',
                'Kertas', 'B3', 'Wadah', 'Botol', 'Tisu',
            ],
            'tujuan_distribusi' => [
                'TPS', 'Pupuk/kompos', 'PlasticPay', 'Tujuan lainnya',
            ],
        ]);
    }
}
