<?php

use App\Http\Controllers\Admin\AccountController;
use App\Http\Middleware\CheckRole;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth', CheckRole::class . ':admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('accounts', [AccountController::class, 'index'])->name('accounts.index');
    Route::get('accounts/create', [AccountController::class, 'create'])->name('accounts.create');
    Route::post('accounts', [AccountController::class, 'store'])->name('accounts.store');
    Route::get('accounts/{user}/edit', [AccountController::class, 'edit'])->name('accounts.edit');
    Route::patch('accounts/{user}', [AccountController::class, 'update'])->name('accounts.update');
    Route::delete('accounts/{user}', [AccountController::class, 'destroy'])->name('accounts.destroy');
});
