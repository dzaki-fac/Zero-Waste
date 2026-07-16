<?php

namespace App\Policies;

use App\Models\Distribusi;
use App\Models\User;

class DistribusiPolicy
{
    public function view(User $user, Distribusi $distribusi): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        return $user->id === $distribusi->user_id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Distribusi $distribusi): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        return $user->id === $distribusi->user_id;
    }

    public function delete(User $user, Distribusi $distribusi): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        return $user->id === $distribusi->user_id;
    }
}
