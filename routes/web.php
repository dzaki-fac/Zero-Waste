<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'dashboard')->name('home');

Route::get('/pengertian', function () {
    return Inertia::render('pengertian');
})->name('pengertian');

Route::get('/struktur', function () {
    return Inertia::render('struktur');
})->name('struktur');

require __DIR__.'/settings.php';