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
            $table->foreignId('master_pekerjaan_id')->nullable()->after('id')->constrained('master_pekerjaan')->nullOnDelete();
            $table->string('nama_pekerjaan_snapshot')->nullable()->after('tugas');
            $table->string('jenis_pekerjaan_snapshot', 20)->nullable()->after('nama_pekerjaan_snapshot');
        });

        $insert = [];
        foreach ($this->tugasList as $i => $tugas) {
            $jenis = $i < 7 ? 'harian' : ($i < 12 ? 'mingguan' : 'bulanan');
            $insert[] = [
                'nama_pekerjaan' => $tugas,
                'jenis_pekerjaan' => $jenis,
                'urutan' => $i + 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('master_pekerjaan')->insert($insert);

        DB::statement('
            UPDATE checklist_pekerjaan c
            JOIN master_pekerjaan m ON m.nama_pekerjaan = c.tugas
            SET c.master_pekerjaan_id = m.id,
                c.nama_pekerjaan_snapshot = c.tugas,
                c.jenis_pekerjaan_snapshot = c.jenis_pekerjaan
        ');
    }

    public function down(): void
    {
        Schema::table('checklist_pekerjaan', function (Blueprint $table) {
            $table->dropConstrainedForeignId('master_pekerjaan_id');
            $table->dropColumn('nama_pekerjaan_snapshot');
            $table->dropColumn('jenis_pekerjaan_snapshot');
        });

        DB::table('master_pekerjaan')->truncate();
    }
};
