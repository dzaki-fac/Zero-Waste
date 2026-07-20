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
        $jenis = OptionHelper::get('jenis_sampah');

        $rules = [
            'nama' => ['required', 'string', 'max:255'],
            'tanggal' => ['required', 'date'],
        ];

        if (in_array($this->input('_redirect'), ['/form', '/admin'])) {
            $rules['items'] = ['required', 'array', 'min:1'];
            $rules['items.*.jenis_sampah'] = ['required', Rule::in($jenis)];
            $rules['items.*.berat'] = ['nullable', 'numeric', 'min:0'];
        } else {
            $rules['berat_sampah'] = ['required', 'numeric', 'min:0'];
            $rules['area'] = ['required', Rule::in($areaValues)];
            $rules['jenis_sampah'] = ['nullable', Rule::in($jenis)];
        }

        return $rules;
    }
}
