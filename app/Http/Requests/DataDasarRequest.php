<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DataDasarRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'nama_tim' => ['required', 'string', 'max:255'],
            'fakultas' => ['required', 'string', 'max:255'],
            'alamat' => ['nullable', 'string'],
            'penanggung_jawab' => ['required', 'string', 'max:255'],
            'nomor_hp_email' => ['required', 'string', 'max:255'],
            'tanggal_pengisian' => ['required', 'date'],
            'jumlah_mahasiswa' => ['required', 'integer', 'min:0'],
            'jumlah_dosen' => ['required', 'integer', 'min:0'],
            'jumlah_tendik' => ['required', 'integer', 'min:0'],
            'jumlah_tenaga_pendukung' => ['required', 'integer', 'min:0'],
            'luas_area_fakultas' => ['required', 'numeric', 'min:0'],
            'luas_area_objek_lomba' => ['nullable', 'numeric', 'min:0'],
            'baseline_sampah' => ['required', 'numeric', 'min:0'],
            'baseline_sampah_periode' => ['required', 'in:hari,minggu'],
            'jenis_sampah_dominan' => ['nullable', 'array'],
            'jenis_sampah_dominan.*.kategori' => ['required', 'string'],
            'jenis_sampah_dominan.*.berat' => ['required', 'numeric', 'min:0'],
            'jenis_sampah_dominan.*.periode' => ['required', 'in:hari,minggu'],
            'kondisi_fasilitas' => ['nullable', 'string'],
        ];
    }
}
