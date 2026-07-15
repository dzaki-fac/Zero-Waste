<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PenimbanganRequest extends FormRequest
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
            'berat_sampah' => ['required', 'numeric', 'min:0'],
            'area' => ['required', 'in:Lantai 1,Lantai 2,Lantai 3,Lantai 4,Area Teras,Area Halaman,Area Parkir'],
            'sub_area' => ['nullable', 'string', 'max:255'],
        ];
    }
}
