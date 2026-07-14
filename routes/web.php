<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'dashboard')->name('home');

require __DIR__.'/settings.php';
