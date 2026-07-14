<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PenimbanganRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'nama' => ['required', 'string', 'max:255'],
            'tanggal' => ['required', 'date'],
            'berat_sampah' => ['required', 'numeric', 'min:0'],
            'area' => ['required', 'in:Utara,Selatan,Timur,Barat'],
            'sub_area' => ['required', 'string', 'max:255'],
        ];
    }
}
