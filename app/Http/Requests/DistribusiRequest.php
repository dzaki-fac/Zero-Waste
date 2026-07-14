<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DistribusiRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'nama' => ['required', 'string', 'max:255'],
            'tanggal' => ['required', 'date'],
            'berat' => ['required', 'numeric', 'min:0'],
            'jenis_sampah' => ['required', 'in:organik,anorganik,B3'],
            'tujuan_distribusi' => ['required', 'string', 'max:255'],
            'lokasi' => ['required', 'string', 'max:255'],
        ];
    }
}
