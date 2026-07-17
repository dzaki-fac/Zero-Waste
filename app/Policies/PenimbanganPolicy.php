<?php

namespace App\Policies;

use App\Models\Penimbangan;
use App\Models\User;

class PenimbanganPolicy
{
    public function view(User $user, Penimbangan $penimbangan): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        return $user->id === $penimbangan->user_id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Penimbangan $penimbangan): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        return $user->id === $penimbangan->user_id;
    }

    public function delete(User $user, Penimbangan $penimbangan): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        return $user->id === $penimbangan->user_id;
    }
}
