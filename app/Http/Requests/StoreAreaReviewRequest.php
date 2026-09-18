<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAreaReviewRequest extends FormRequest
{
    public function rules(): array
    {
        $areaId = $this->integer('area_id');

        return [
            'area_id' => [
                'required',
                'integer',
                Rule::exists('areas', 'id')->where('is_active', true),
            ],
            'sub_area_id' => [
                'nullable',
                'integer',
                Rule::exists('sub_areas', 'id')->where('area_id', $areaId)->where('is_active', true),
            ],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'area_id.required' => 'Silakan pilih area.',
            'area_id.exists' => 'Area yang dipilih tidak tersedia atau tidak aktif.',
            'sub_area_id.exists' => 'Bagian yang dipilih tidak tersedia atau tidak valid untuk area ini.',
            'rating.required' => 'Silakan berikan rating.',
            'rating.integer' => 'Rating tidak valid.',
            'rating.min' => 'Rating minimal 1.',
            'rating.max' => 'Rating maksimal 5.',
            'comment.max' => 'Komentar maksimal 1000 karakter.',
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('comment')) {
            $this->merge([
                'comment' => trim($this->input('comment')),
            ]);
        }
    }
}
