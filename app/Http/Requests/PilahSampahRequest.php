<?php

namespace App\Http\Requests;

use App\Helpers\OptionHelper;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PilahSampahRequest extends FormRequest
{
    public function rules(): array
    {
        $subjenis = OptionHelper::get('subjenis_sampah');
        $area = OptionHelper::get('area');

        $rules = [
            'nama' => ['required', 'string', 'max:255'],
            'tanggal' => ['required', 'date'],
            'area' => ['nullable', Rule::in($area)],
        ];

        if ($this->input('_redirect') === '/form') {
            $rules['items'] = ['required', 'array', 'min:1'];
            $rules['items.*.subjenis_sampah'] = ['required', Rule::in($subjenis)];
            $rules['items.*.berat'] = ['nullable', 'numeric', 'min:0'];
        } else {
            $rules['berat'] = ['required', 'numeric', 'min:0'];
            $rules['subjenis_sampah'] = ['required', Rule::in($subjenis)];
        }

        return $rules;
    }
}
