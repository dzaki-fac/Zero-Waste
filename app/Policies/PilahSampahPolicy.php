<?php

namespace App\Policies;

use App\Models\PilahSampah;
use App\Models\User;

class PilahSampahPolicy
{
    public function view(User $user, PilahSampah $pilahSampah): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        return $user->id === $pilahSampah->user_id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, PilahSampah $pilahSampah): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        return $user->id === $pilahSampah->user_id;
    }

    public function delete(User $user, PilahSampah $pilahSampah): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        return $user->id === $pilahSampah->user_id;
    }
}
