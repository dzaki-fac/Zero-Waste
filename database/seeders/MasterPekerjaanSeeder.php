<?php

namespace Database\Seeders;

use App\Models\MasterPekerjaan;
use Illuminate\Database\Seeder;

class MasterPekerjaanSeeder extends Seeder
{
    private array $tugasList = [
        'Membersihkan furniture, meja, kursi, laci, lemari dari debu yang menempel',
        'Membersihkan noda yang terdapat di pintu masuk atau front office',
        'Membersihkan interior pintu dan seluruh permukaan kaca yang ada di kantor',
        'Menyedot debu di area yang dilapisi karpet agar tidak berdebu',
        'Vakum permukaan lantai yang keras atau mengepelnya hingga kering',
        'Kosongkan tempat sampah dan membuangnya ke pembuangan sampah',
        'Menyikat lantai dan WC kamar mandi',
        'Membersihkan kusen jendela dan bagian atas partisi kantor agar tidak berdebu',
        'Membersihkan kusen pintu dan ambang pintu dari kotoran dan debu',
        'Jika ada telepon kantor, bersihkan dan sterilkan dengan cairan pembersih',
        'Vakum permukaan kayu yang keras dan lantai yang sulit dipel',
        'Mengganti sarung bantal sofa jika tersedia',
        'Membersihkan permukaan atau area yang tinggi dan sulit dijangkau seperti kipas langit-langit, ventilasi dan rak',
        'Membersihkan tirai dari debu yang menempel',
        'Membersihkan saklar lampu dengan lap basah',
        'Membersihkan furniture kayu',
        'Membersihkan barang yang ditumbuhi sarang laba-laba',
        'Membersihkan tepi sudut karpet dengan vakum',
        'Bersihkan jok kursi dengan vakum',
        'Mengganti pengharum kamar mandi dan ruangan',
    ];

    public function run(): void
    {
        foreach ($this->tugasList as $i => $tugas) {
            $jenis = $i < 7 ? 'harian' : ($i < 12 ? 'mingguan' : 'bulanan');

            MasterPekerjaan::firstOrCreate(
                ['nama_pekerjaan' => $tugas],
                [
                    'jenis_pekerjaan' => $jenis,
                    'urutan' => $i + 1,
                    'is_active' => true,
                ]
            );
        }
    }
}
