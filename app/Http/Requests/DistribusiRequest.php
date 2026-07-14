<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DistribusiRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'nama' => ['required', 'string', 'max:255'],
            'tanggal' => ['required', 'date'],
            'berat' => ['required', 'numeric', 'min:0'],
            'jenis_sampah' => ['required', 'in:Daun,Ranting besar,Ranting kecil,Sisa makanan,Plastik berwarna,Plastik putih,Styrofoam,Botol,Kardus dan Kertas,B3,Lainnya'],
            'tujuan_distribusi' => ['required', 'in:TPS,Pupuk/kompos,PlasticPay,Tujuan lainnya'],
            'lokasi' => ['required', 'string', 'max:255'],
        ];
    }
}
