<?php

use App\Http\Controllers\ChecklistPekerjaanController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DistribusiController;
use App\Http\Controllers\KelolaDataController;
use App\Http\Controllers\MasterPekerjaanController;
use App\Http\Controllers\PenimbanganController;
use App\Http\Controllers\PilahSampahController;
use App\Http\Middleware\CheckRole;
use Illuminate\Support\Facades\Route;

// Public landing page (BrowserRouter-based, no auth required)
Route::view('/', 'home')->name('home');
Route::view('/pengertian', 'home');
Route::view('/struktur', 'home');
Route::view('/sop', 'home');

// Shared routes (accessible by both roles, no role check)
Route::middleware(['auth'])->group(function () {
    Route::inertia('/form', 'welcome')->name('form');
    Route::inertia('form/penimbangan', 'form/penimbangan')->name('form.penimbangan');
    Route::inertia('form/pilah-sampah', 'form/pilah-sampah')->name('form.pilah-sampah');
    Route::inertia('form/distribusi', 'form/distribusi')->name('form.distribusi');

    Route::post('form/penimbangan', [PenimbanganController::class, 'store'])->name('form.penimbangan.store');
    Route::post('form/pilah-sampah', [PilahSampahController::class, 'store'])->name('form.pilah-sampah.store');
    Route::post('form/distribusi', [DistribusiController::class, 'store'])->name('form.distribusi.store');

    Route::middleware([CheckRole::class . ':admin'])->prefix('admin')->group(function () {
        Route::get('kelola-data', [KelolaDataController::class, 'index'])->name('settings.index');
        Route::post('kelola-data', [KelolaDataController::class, 'update'])->name('settings.update');
    });
});

// Admin routes
Route::middleware(['auth', CheckRole::class . ':admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('penimbangan/export', [PenimbanganController::class, 'export'])->name('penimbangan.export');
        Route::resource('penimbangan', PenimbanganController::class)->names('penimbangan');

        Route::get('pilah-sampah/export', [PilahSampahController::class, 'export'])->name('pilah-sampah.export');
        Route::resource('pilah-sampah', PilahSampahController::class)->names('pilah-sampah');

        Route::get('distribusi/export', [DistribusiController::class, 'export'])->name('distribusi.export');
        Route::resource('distribusi', DistribusiController::class)->names('distribusi');

        Route::get('checklist-pekerjaan/export', [ChecklistPekerjaanController::class, 'export'])->name('checklist-pekerjaan.export');
        Route::get('checklist-pekerjaan/export-all', [ChecklistPekerjaanController::class, 'exportAll'])->name('checklist-pekerjaan.export-all');
        Route::get('checklist-pekerjaan/{petugas}/history', [ChecklistPekerjaanController::class, 'history'])->name('checklist-pekerjaan.history');
        Route::resource('checklist-pekerjaan', ChecklistPekerjaanController::class)
            ->only(['index', 'show', 'store'])
            ->names('checklist-pekerjaan');

        Route::resource('kelola-pekerjaan', MasterPekerjaanController::class)
            ->only(['index', 'store', 'update', 'destroy'])
            ->parameters(['kelola-pekerjaan' => 'masterPekerjaan'])
            ->names('kelola-pekerjaan');
    });

// Petugas routes
Route::middleware(['auth', CheckRole::class . ':petugas'])
    ->prefix('petugas')
    ->name('petugas.')
    ->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('penimbangan/export', [PenimbanganController::class, 'export'])->name('penimbangan.export');
        Route::resource('penimbangan', PenimbanganController::class)->names('penimbangan');

        Route::get('pilah-sampah/export', [PilahSampahController::class, 'export'])->name('pilah-sampah.export');
        Route::resource('pilah-sampah', PilahSampahController::class)->names('pilah-sampah');

        Route::get('distribusi/export', [DistribusiController::class, 'export'])->name('distribusi.export');
        Route::resource('distribusi', DistribusiController::class)->names('distribusi');
    });
