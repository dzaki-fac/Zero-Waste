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
                'Area Teras', 'Area Halaman & Parkir',
                'UNDIP Press',
            ],
            'jenis_sampah' => [
                'Plastik Kresek & Bungkus', 'Sampah Tisu', 'Kaleng & Botol Kaca',
                'Sisa Makanan', 'Plastik Botol & Wadah', 'Styrofoam', 'Daun', 'Ranting',
            ],
            'jenis_detail' => [
                'Daun', 'Ranting besar', 'Ranting kecil', 'Sisa makanan',
                'Plastik berwarna', 'Plastik putih', 'Styrofoam', 'Kardus',
                'Kertas', 'B3', 'Wadah', 'Botol', 'Tisu',
            ],
            'tujuan_distribusi' => [
                'TPS', 'Pupuk/kompos', 'PlasticPay', 'Tujuan lainnya',
            ],
            'rincian_area' => [
                ['nama' => 'Lantai 1', 'deskripsi' => 'Ruang baca utama, lobby, dan area administrasi', 'luas' => 1200],
                ['nama' => 'Lantai 2', 'deskripsi' => 'Ruang koleksi, sirkulasi, dan ruang diskusi', 'luas' => 1200],
                ['nama' => 'Lantai 3', 'deskripsi' => 'Ruang referensi, jurnal, dan ruang baca tenang', 'luas' => 1200],
                ['nama' => 'Lantai 4', 'deskripsi' => 'Ruang audio visual, ruang rapat, dan multimedia', 'luas' => 1000],
                ['nama' => 'Area Teras', 'deskripsi' => 'Teras depan dan belakang gedung', 'luas' => 300],
                ['nama' => 'Area Halaman & Parkir', 'deskripsi' => 'Halaman, taman, area penghijauan, dan parkir kendaraan', 'luas' => 3300],
                ['nama' => 'UNDIP Press', 'deskripsi' => 'Kantor penerbitan UNDIP Press', 'luas' => 300],
            ],
        ]);
    }
}
