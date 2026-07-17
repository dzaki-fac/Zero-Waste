<?php

use App\Models\Distribusi;
use App\Models\Penimbangan;
use App\Models\PilahSampah;
use App\Models\User;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('admin.dashboard'));
    $response->assertRedirect(route('login'));
});

test('admin can access the dashboard', function () {
    $user = User::factory()->admin()->create();
    $this->actingAs($user);

    $response = $this->get(route('admin.dashboard'));
    $response->assertOk();
});

test('petugas can access the dashboard', function () {
    $user = User::factory()->petugas()->create();
    $this->actingAs($user);

    $response = $this->get(route('petugas.dashboard'));
    $response->assertOk();
});

test('petugas dashboard totals only contain their own records', function () {
    $petugas = User::factory()->petugas()->create();
    $otherPetugas = User::factory()->petugas()->create();

    Penimbangan::factory()->create(['user_id' => $petugas->id, 'berat_sampah' => 100]);
    Penimbangan::factory()->create(['user_id' => $otherPetugas->id, 'berat_sampah' => 200]);

    $this->actingAs($petugas);

    $response = $this->get(route('petugas.dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->where('petugasStats.0.name', $petugas->name)
        ->has('petugasStats', 1)
    );
});

test('admin dashboard totals contain all records', function () {
    $admin = User::factory()->admin()->create();
    $petugasA = User::factory()->petugas()->create();
    $petugasB = User::factory()->petugas()->create();

    Penimbangan::factory()->create(['user_id' => $petugasA->id, 'berat_sampah' => 100]);
    Penimbangan::factory()->create(['user_id' => $petugasB->id, 'berat_sampah' => 200]);
    PilahSampah::factory()->create(['user_id' => $petugasA->id, 'berat' => 50]);
    Distribusi::factory()->create(['user_id' => $petugasB->id, 'berat' => 30]);

    $this->actingAs($admin);

    $response = $this->get(route('admin.dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->has('petugasStats', 2)
    );
});
