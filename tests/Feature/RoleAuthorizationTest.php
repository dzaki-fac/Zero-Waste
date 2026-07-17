<?php

use App\Models\User;

test('admin login redirects to admin dashboard', function () {
    $user = User::factory()->admin()->create();

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertRedirect(route('admin.dashboard', absolute: false));
});

test('petugas login redirects to form', function () {
    $user = User::factory()->petugas()->create();

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertRedirect(route('petugas.form', absolute: false));
});

test('petugas can access penimbangan index', function () {
    $user = User::factory()->petugas()->create();
    $this->actingAs($user);

    $response = $this->get(route('petugas.penimbangan.index'));
    $response->assertOk();
});

test('petugas can access pilah sampah index', function () {
    $user = User::factory()->petugas()->create();
    $this->actingAs($user);

    $response = $this->get(route('petugas.pilah-sampah.index'));
    $response->assertOk();
});

test('petugas can access distribusi index', function () {
    $user = User::factory()->petugas()->create();
    $this->actingAs($user);

    $response = $this->get(route('petugas.distribusi.index'));
    $response->assertOk();
});

test('petugas receives 403 when accessing account management', function () {
    $user = User::factory()->petugas()->create();
    $this->actingAs($user);

    $response = $this->get(route('admin.accounts.index'));
    $response->assertForbidden();
});

test('admin can access account management', function () {
    $user = User::factory()->admin()->create();
    $this->actingAs($user);

    $response = $this->get(route('admin.accounts.index'));
    $response->assertOk();
});

test('petugas receives 403 when accessing checklist pekerjaan', function () {
    $user = User::factory()->petugas()->create();
    $this->actingAs($user);

    $response = $this->get(route('admin.checklist-pekerjaan.index'));
    $response->assertForbidden();
});

test('admin can access checklist pekerjaan', function () {
    $user = User::factory()->admin()->create();
    $this->actingAs($user);

    $response = $this->get(route('admin.checklist-pekerjaan.index'));
    $response->assertOk();
});

test('petugas receives 403 when accessing kelola pekerjaan', function () {
    $user = User::factory()->petugas()->create();
    $this->actingAs($user);

    $response = $this->get(route('admin.kelola-pekerjaan.index'));
    $response->assertForbidden();
});

test('petugas receives 403 when accessing admin dashboard', function () {
    $user = User::factory()->petugas()->create();
    $this->actingAs($user);

    $response = $this->get(route('admin.dashboard'));
    $response->assertForbidden();
});

test('admin receives 403 when accessing petugas dashboard', function () {
    $user = User::factory()->admin()->create();
    $this->actingAs($user);

    $response = $this->get(route('petugas.dashboard'));
    $response->assertForbidden();
});
