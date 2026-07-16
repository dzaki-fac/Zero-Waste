<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
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

    public function up(): void
    {
        Schema::table('checklist_pekerjaan', function (Blueprint $table) {
            $table->string('jenis_pekerjaan', 20)->after('nip');
        });

        $harian = array_slice($this->tugasList, 0, 7);
        $mingguan = array_slice($this->tugasList, 7, 5);
        $bulanan = array_slice($this->tugasList, 12, 8);

        DB::table('checklist_pekerjaan')
            ->whereIn('tugas', $harian)
            ->update(['jenis_pekerjaan' => 'harian']);

        DB::table('checklist_pekerjaan')
            ->whereIn('tugas', $mingguan)
            ->update(['jenis_pekerjaan' => 'mingguan']);

        DB::table('checklist_pekerjaan')
            ->whereIn('tugas', $bulanan)
            ->update(['jenis_pekerjaan' => 'bulanan']);
    }

    public function down(): void
    {
        Schema::table('checklist_pekerjaan', function (Blueprint $table) {
            $table->dropColumn('jenis_pekerjaan');
        });
    }
};
