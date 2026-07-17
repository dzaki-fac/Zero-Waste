<?php

namespace App\Http\Requests;

use App\Helpers\OptionHelper;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DistribusiRequest extends FormRequest
{
    public function rules(): array
    {
        $subjenis = OptionHelper::get('subjenis_sampah');
        $tujuanDistribusi = OptionHelper::get('tujuan_distribusi');

        $rules = [
            'nama' => ['required', 'string', 'max:255'],
            'tanggal' => ['required', 'date'],
            'tujuan_distribusi' => ['required'],
            'lokasi' => ['required', 'string', 'max:255'],
        ];

        if ($this->input('_redirect') === '/form') {
            $rules['items'] = ['required', 'array', 'min:1'];
            $rules['items.*.subjenis_sampah'] = ['required', Rule::in($subjenis)];
            $rules['items.*.berat'] = ['nullable', 'numeric', 'min:0'];
        } else {
            $rules['berat'] = ['required', 'numeric', 'min:0'];
            $rules['jenis_sampah'] = ['required', Rule::in($subjenis)];
            $rules['tujuan_distribusi'][] = Rule::in($tujuanDistribusi);
        }

        return $rules;
    }
}
