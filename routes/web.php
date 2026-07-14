<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DistribusiController;
use App\Http\Controllers\PenimbanganController;
use App\Http\Controllers\PilahSampahController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth'])->group(function () {
    Route::resource('penimbangan', PenimbanganController::class);
    Route::resource('pilah-sampah', PilahSampahController::class);
    Route::resource('distribusi', DistribusiController::class);

    Route::get('admin/dashboard', [DashboardController::class, 'index'])->name('dashboard')->middleware('verified');
});


