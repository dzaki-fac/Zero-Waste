<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $totalUsers = User::count();
        $adminCount = User::where('role', 'admin')->count();
        $petugasCount = User::where('role', 'petugas')->count();

        $recentUsers = User::latest()
            ->take(5)
            ->get()
            ->map(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'created_at' => $user->created_at->diffForHumans(),
            ]);

        return Inertia::render('dashboard', [
            'stats' => [
                'total_users' => $totalUsers,
                'total_admin' => $adminCount,
                'total_petugas' => $petugasCount,
            ],
            'recent_users' => $recentUsers,
        ]);
    }
}
