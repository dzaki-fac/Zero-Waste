<?php

use Illuminate\Support\Facades\Route;

Route::view('/', 'app')->name('home');
Route::view('/sop', 'app');
Route::view('/alur', 'app');

require __DIR__.'/settings.php';
