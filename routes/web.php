<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DistribusiController;
use App\Http\Controllers\PenimbanganController;
use App\Http\Controllers\PilahSampahController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth'])->group(function () {
    Route::resource('admin/penimbangan', PenimbanganController::class)->names('penimbangan');
    Route::resource('admin/pilah-sampah', PilahSampahController::class)->names('pilah-sampah');
    Route::resource('admin/distribusi', DistribusiController::class)->names('distribusi');

    Route::get('admin/dashboard', [DashboardController::class, 'index'])->name('dashboard')->middleware('verified');
});


