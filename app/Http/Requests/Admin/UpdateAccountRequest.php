<?php

namespace App\Http\Requests\Admin;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateAccountRequest extends FormRequest
{
    public function rules(): array
    {
        $user = $this->route('user');

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique(User::class)->ignore($user)],
            'nip' => ['nullable', 'string', 'max:30', Rule::unique(User::class)->ignore($user)],
            'role' => ['required', 'string', Rule::in(['admin', 'petugas'])],
            'password' => ['nullable', 'string', Password::default(), 'confirmed'],
        ];
    }
}
