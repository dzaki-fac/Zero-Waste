<?php

use Illuminate\Support\Facades\Route;

Route::view('/', 'app')->name('home');
Route::view('/sop', 'app');
Route::view('/alur', 'app');
Route::view('/pengertian', 'app');
Route::view('/struktur', 'app');

require __DIR__.'/settings.php';