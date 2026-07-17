<?php

use App\Http\Controllers\AkunController;
use App\Http\Middleware\CheckRole;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth', CheckRole::class . ':admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('akun', [AkunController::class, 'index'])->name('accounts.index');
    Route::get('akun/create', [AkunController::class, 'create'])->name('accounts.create');
    Route::post('akun', [AkunController::class, 'store'])->name('accounts.store');
    Route::get('akun/{user}/edit', [AkunController::class, 'edit'])->name('accounts.edit');
    Route::patch('akun/{user}', [AkunController::class, 'update'])->name('accounts.update');
    Route::delete('akun/{user}', [AkunController::class, 'destroy'])->name('accounts.destroy');
});
