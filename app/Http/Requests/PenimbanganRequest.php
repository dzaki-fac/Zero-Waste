<?php

namespace App\Http\Requests;

use App\Helpers\OptionHelper;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PenimbanganRequest extends FormRequest
{
    public function rules(): array
    {
        $areaValues = OptionHelper::get('area');

        return [
            'nama' => ['required', 'string', 'max:255'],
            'tanggal' => ['required', 'date'],
            'berat_sampah' => ['required', 'numeric', 'min:0'],
            'area' => ['required', Rule::in($areaValues)],
            'sub_area' => ['nullable', 'string', 'max:255'],
        ];
    }
}
