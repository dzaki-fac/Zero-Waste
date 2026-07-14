<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAccountRequest;
use App\Http\Requests\Admin\UpdateAccountRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function index(Request $request): Response
    {
        $users = User::query()
            ->when($request->filled('role'), function ($q) use ($request) {
                if ($request->role === 'all') {
                    return;
                }
                $q->where('role', $request->role);
            })
            ->when($request->filled('search'), function ($q) use ($request) {
                $search = $request->search;
                $q->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('nip', 'like', "%{$search}%");
                });
            })
            ->orderByRaw("FIELD(role, 'admin', 'petugas')")
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'nip' => $user->nip,
                'email' => $user->email,
                'role' => $user->role,
            ]);

        return Inertia::render('admin/accounts/index', [
            'users' => $users,
            'filters' => $request->only(['role', 'search']),
            'current_user_id' => $request->user()->id,
            'current_user_role' => $request->user()->role,
        ]);
    }

    public function create(Request $request): RedirectResponse
    {
        return to_route('admin.accounts.index');
    }

    public function edit(Request $request, User $user): RedirectResponse
    {
        return to_route('admin.accounts.index');
    }

    public function store(StoreAccountRequest $request): RedirectResponse
    {
        User::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Account created.')]);

        return to_route('admin.accounts.index');
    }

    public function update(UpdateAccountRequest $request, User $user): RedirectResponse
    {
        $authUser = $request->user();

        if ($authUser->id === $user->id && $request->input('role') !== $authUser->role) {
            abort(403, 'You cannot change your own role.');
        }

        $data = $request->validated();

        if (empty($data['password'])) {
            unset($data['password']);
        }

        $user->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Account updated.')]);

        return to_route('admin.accounts.index');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        $authUser = $request->user();

        if ($authUser->id === $user->id) {
            abort(403, 'You cannot delete your own account.');
        }

        $user->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Account deleted.')]);

        return to_route('admin.accounts.index');
    }
}
