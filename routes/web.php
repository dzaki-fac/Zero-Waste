<?php

use App\Http\Controllers\ChecklistPekerjaanController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DistribusiController;
use App\Http\Controllers\MasterPekerjaanController;
use App\Http\Controllers\PenimbanganController;
use App\Http\Controllers\PilahSampahController;
use App\Http\Middleware\CheckRole;
use Illuminate\Support\Facades\Route;

Route::inertia('/form', 'welcome')->name('home');

Route::middleware(['auth'])->group(function () {
    Route::resource('admin/penimbangan', PenimbanganController::class)->names('penimbangan');
    Route::resource('admin/pilah-sampah', PilahSampahController::class)->names('pilah-sampah');
    Route::resource('admin/distribusi', DistribusiController::class)->names('distribusi');

    Route::inertia('form/penimbangan', 'form/penimbangan')->name('form.penimbangan');
    Route::inertia('form/pilah-sampah', 'form/pilah-sampah')->name('form.pilah-sampah');
    Route::inertia('form/distribusi', 'form/distribusi')->name('form.distribusi');

    Route::get('admin/dashboard', [DashboardController::class, 'index'])->name('dashboard')->middleware(['verified', CheckRole::class . ':admin']);

    Route::middleware([CheckRole::class . ':admin'])->group(function () {
        Route::get('admin/checklist-pekerjaan/export', [ChecklistPekerjaanController::class, 'export'])->name('checklist-pekerjaan.export');
        Route::get('admin/checklist-pekerjaan/export-all', [ChecklistPekerjaanController::class, 'exportAll'])->name('checklist-pekerjaan.export-all');
        Route::get('admin/checklist-pekerjaan/{petugas}/history', [ChecklistPekerjaanController::class, 'history'])->name('checklist-pekerjaan.history');
        Route::resource('admin/checklist-pekerjaan', ChecklistPekerjaanController::class)
            ->only(['index', 'show', 'store'])
            ->names('checklist-pekerjaan');

        Route::resource('admin/kelola-pekerjaan', MasterPekerjaanController::class)
            ->only(['index', 'store', 'update', 'destroy'])
            ->parameters(['kelola-pekerjaan' => 'masterPekerjaan'])
            ->names('admin.kelola-pekerjaan');
    });
});


