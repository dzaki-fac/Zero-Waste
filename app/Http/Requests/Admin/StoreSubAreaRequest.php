<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSubAreaRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'area_id' => [
                'required',
                'integer',
                Rule::exists('areas', 'id'),
            ],
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('sub_areas', 'name')
                    ->where(fn ($query) => $query->where('area_id', $this->integer('area_id'))),
            ],
            'description' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'area_id.required' => 'Area wajib dipilih.',
            'area_id.exists' => 'Area tidak ditemukan.',
            'name.required' => 'Nama bagian wajib diisi.',
            'name.max' => 'Nama bagian maksimal 100 karakter.',
            'name.unique' => 'Nama bagian sudah ada pada area yang dipilih.',
            'sort_order.integer' => 'Urutan harus berupa angka.',
            'sort_order.min' => 'Urutan minimal 0.',
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('name')) {
            $this->merge([
                'name' => trim($this->input('name')),
            ]);
        }
    }
}
