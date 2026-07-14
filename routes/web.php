<?php

use App\Http\Controllers\DistribusiController;
use App\Http\Controllers\PenimbanganController;
use App\Http\Controllers\PilahSampahController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::resource('penimbangan', PenimbanganController::class);
Route::resource('pilah-sampah', PilahSampahController::class);
Route::resource('distribusi', DistribusiController::class);
