<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReviewDistribusiRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(['approved', 'needs_revision', 'rejected'])],
            'note' => [
                Rule::requiredIf(fn () => $this->input('status') === 'needs_revision'),
                'nullable',
                'string',
                'max:2000',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Status review wajib dipilih.',
            'status.in' => 'Status review tidak valid.',
            'note.required' => 'Catatan perbaikan wajib diisi.',
            'note.max' => 'Catatan perbaikan maksimal 2000 karakter.',
        ];
    }
}
