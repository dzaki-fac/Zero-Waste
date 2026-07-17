<?php

namespace Database\Seeders;

use App\Models\DataDasar;
use App\Models\User;
use Illuminate\Database\Seeder;

class DataDasarSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@example.com')->first();

        if (!$admin) {
            $this->command->warn('Admin user not found. Skipping DataDasarSeeder.');
            return;
        }

        DataDasar::updateOrCreate(
            ['user_id' => $admin->id],
            [
                'nama_tim' => 'Tim Zero Waste Perpustakaan dan UNDIP Press',
                'fakultas' => 'Perpustakaan dan UNDIP Press Universitas Diponegoro',
                'alamat' => 'Jl. Prof. Soedarto, SH, Tembalang, Semarang',
                'penanggung_jawab' => 'Kepala Perpustakaan dan UNDIP Press',
                'nomor_hp_email' => 'perpustakaan@live.undip.ac.id',
                'tanggal_pengisian' => '2026-07-17',
                'jumlah_mahasiswa' => 250,
                'jumlah_dosen' => 35,
                'jumlah_tendik' => 65,
                'jumlah_tenaga_pendukung' => 20,
                'total_warga' => 370,
                'luas_area_fakultas' => 8500.00,
                'luas_area_objek_lomba' => 7900.00,
                'baseline_sampah' => 145.00,
                'baseline_sampah_periode' => 'hari',
                'jenis_sampah_dominan' => [
                    ['kategori' => 'Daun', 'berat' => 20, 'periode' => 'hari'],
                    ['kategori' => 'Ranting', 'berat' => 5, 'periode' => 'hari'],
                    ['kategori' => 'Sisa Makanan', 'berat' => 30, 'periode' => 'hari'],
                    ['kategori' => 'Plastik', 'berat' => 22, 'periode' => 'hari'],
                    ['kategori' => 'Styrofoam', 'berat' => 3, 'periode' => 'hari'],
                    ['kategori' => 'Botol', 'berat' => 15, 'periode' => 'hari'],
                    ['kategori' => 'Kardus & Kertas', 'berat' => 45, 'periode' => 'hari'],
                    ['kategori' => 'B3', 'berat' => 1, 'periode' => 'hari'],
                    ['kategori' => 'Lainnya', 'berat' => 4, 'periode' => 'hari'],
                ],
                'sampah_residu_akhir' => 89.18,
                'total_sampah_terkelola' => 66.60,
                'jumlah_warga_terlibat_aktif' => 323,
                'luas_area_zero_waste' => 8075.00,
            ]
        );

        $this->command->info('Data dasar berhasil di-seed.');
    }
}
