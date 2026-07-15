<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PilahSampahRequest extends FormRequest
{
    public function rules(): array
    {
        $rules = [
            'nama' => ['required', 'string', 'max:255'],
            'tanggal' => ['required', 'date'],
        ];

        if ($this->input('_redirect') === '/form') {
            $rules['items'] = ['required', 'array', 'min:1'];
            $rules['items.*.jenis_sampah'] = ['required', 'in:Daun,Ranting besar,Ranting kecil,Sisa makanan,Plastik berwarna,Plastik putih,Styrofoam,Botol,Kardus dan Kertas,B3,Lainnya'];
            $rules['items.*.berat'] = ['nullable', 'numeric', 'min:0'];
        } else {
            $rules['berat'] = ['required', 'numeric', 'min:0'];
            $rules['jenis_sampah'] = ['required', 'in:Daun,Ranting besar,Ranting kecil,Sisa makanan,Plastik berwarna,Plastik putih,Styrofoam,Botol,Kardus dan Kertas,B3,Lainnya'];
        }

        return $rules;
    }
}
