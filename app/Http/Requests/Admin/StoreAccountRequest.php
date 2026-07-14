<?php

namespace App\Http\Requests\Admin;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreAccountRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique(User::class)],
            'nip' => ['nullable', 'string', 'max:30', Rule::unique(User::class)],
            'role' => ['required', 'string', Rule::in(['admin', 'petugas'])],
            'password' => ['required', 'string', Password::default(), 'confirmed'],
        ];
    }
}
