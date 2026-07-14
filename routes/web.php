<?php

use App\Http\Controllers\PenimbanganController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::resource('penimbangan', PenimbanganController::class);
