<?php

namespace App\Http\Requests;

use App\Helpers\OptionHelper;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PilahSampahRequest extends FormRequest
{
    public function rules(): array
    {
        $jenisSampah = OptionHelper::get('jenis_sampah');

        $rules = [
            'nama' => ['required', 'string', 'max:255'],
            'tanggal' => ['required', 'date'],
        ];

        if ($this->input('_redirect') === '/form') {
            $rules['items'] = ['required', 'array', 'min:1'];
            $rules['items.*.jenis_sampah'] = ['required', Rule::in($jenisSampah)];
            $rules['items.*.berat'] = ['nullable', 'numeric', 'min:0'];
        } else {
            $rules['berat'] = ['required', 'numeric', 'min:0'];
            $rules['jenis_sampah'] = ['required', Rule::in($jenisSampah)];
        }

        return $rules;
    }
}
