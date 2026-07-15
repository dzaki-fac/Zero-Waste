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
        $rules = [
            'nama' => ['required', 'string', 'max:255'],
            'tanggal' => ['required', 'date'],
            'berat' => ['required', 'numeric', 'min:0'],
            'jenis_sampah' => ['required', 'in:Daun,Ranting besar,Ranting kecil,Sisa makanan,Plastik berwarna,Plastik putih,Styrofoam,Botol,Kardus dan Kertas,B3,Lainnya'],
            'tujuan_distribusi' => ['required'],
            'lokasi' => ['required', 'string', 'max:255'],
        ];

        if ($this->input('_redirect') !== '/form') {
            $rules['tujuan_distribusi'][] = 'in:TPS,Pupuk/kompos,PlasticPay,Tujuan lainnya';
        }

        return $rules;
    }
}
