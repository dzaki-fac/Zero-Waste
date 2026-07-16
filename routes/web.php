<?php

use App\Http\Controllers\KelolaDataController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DistribusiController;
use App\Http\Controllers\PenimbanganController;
use App\Http\Controllers\PilahSampahController;
use App\Http\Middleware\CheckRole;
use Illuminate\Support\Facades\Route;

Route::inertia('/form', 'welcome')->name('home');

Route::middleware(['auth'])->group(function () {
    Route::resource('admin/penimbangan', PenimbanganController::class)->names('penimbangan');
    Route::resource('admin/pilah-sampah', PilahSampahController::class)->names('pilah-sampah');
    Route::resource('admin/distribusi', DistribusiController::class)->names('distribusi');

    Route::inertia('form/penimbangan', 'form/penimbangan')->name('form.penimbangan');
    Route::inertia('form/pilah-sampah', 'form/pilah-sampah')->name('form.pilah-sampah');
    Route::inertia('form/distribusi', 'form/distribusi')->name('form.distribusi');

    Route::get('admin/dashboard', [DashboardController::class, 'index'])->name('dashboard')->middleware(['verified', CheckRole::class . ':admin']);

    Route::middleware([CheckRole::class . ':admin'])->prefix('admin')->group(function () {
        Route::get('kelola-data', [KelolaDataController::class, 'index'])->name('settings.index');
        Route::post('kelola-data', [KelolaDataController::class, 'update'])->name('settings.update');
    });
});


