<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DistribusiController;
use App\Http\Controllers\PenimbanganController;
use App\Http\Controllers\PilahSampahController;
use App\Http\Middleware\CheckRole;
use Illuminate\Support\Facades\Route;

Route::inertia('/form', 'welcome')->name('home');

Route::middleware(['auth'])->group(function () {
    Route::resource('penimbangan', PenimbanganController::class);
    Route::resource('pilah-sampah', PilahSampahController::class);
    Route::resource('distribusi', DistribusiController::class);

    Route::inertia('form/penimbangan', 'form/penimbangan')->name('form.penimbangan');
    Route::inertia('form/pilah-sampah', 'form/pilah-sampah')->name('form.pilah-sampah');
    Route::inertia('form/distribusi', 'form/distribusi')->name('form.distribusi');

    Route::get('admin/dashboard', [DashboardController::class, 'index'])->name('dashboard')->middleware(['verified', CheckRole::class . ':admin']);
});


