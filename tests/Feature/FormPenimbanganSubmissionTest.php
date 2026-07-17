<?php

use App\Models\Penimbangan;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('petugas can submit penimbangan form with _redirect and get success modal data', function () {
    $petugas = User::factory()->petugas()->create();

    $initialCount = Penimbangan::count();
    $testWeight = 12.34;

    $response = $this
        ->actingAs($petugas)
        ->from('/form/penimbangan')
        ->post('/petugas/penimbangan', [
            '_redirect' => '/form',
            'nama' => $petugas->name,
            'tanggal' => now()->format('Y-m-d H:i'),
            'berat_sampah' => $testWeight,
            'area' => 'Lantai 1',
            'sub_area' => 'Area Baca',
        ]);

    $response->assertRedirect('/form/penimbangan');
    $response->assertSessionHas('submitted');

    $submitted = session('submitted');
    expect($submitted['berat_sampah'])->toBe('12.34');
    expect($submitted['area'])->toBe('Lantai 1');
    expect($submitted['sub_area'])->toBe('Area Baca');
    expect($submitted['nama'])->toBe($petugas->name);

    $this->assertDatabaseHas('penimbangan', [
        'user_id' => $petugas->id,
        'berat_sampah' => 12.34,
        'nama' => $petugas->name,
    ]);

    expect(Penimbangan::count())->toBe($initialCount + 1);

    $record = Penimbangan::latest()->first();
    expect($record->user_id)->toBe($petugas->id);
    expect((float) $record->berat_sampah)->toBe(12.34);
});

test('petugas store maps user_id to authenticated user, ignoring user_id from request', function () {
    $petugas = User::factory()->petugas()->create();
    $otherUser = User::factory()->petugas()->create();

    $this
        ->actingAs($petugas)
        ->post('/petugas/penimbangan', [
            'nama' => $petugas->name,
            'tanggal' => now()->format('Y-m-d H:i'),
            'berat_sampah' => 5.5,
            'area' => 'Lantai 2',
            'sub_area' => null,
            'user_id' => $otherUser->id,
        ]);

    $record = Penimbangan::latest()->first();
    expect($record->user_id)->toBe($petugas->id);
    expect($record->user_id)->not->toBe($otherUser->id);
});

test('admin cannot submit to petugas penimbangan store', function () {
    $admin = User::factory()->admin()->create();

    $response = $this
        ->actingAs($admin)
        ->post('/petugas/penimbangan', [
            'nama' => $admin->name,
            'tanggal' => now()->format('Y-m-d H:i'),
            'berat_sampah' => 10,
            'area' => 'Lantai 1',
        ]);

    $response->assertForbidden();
});

test('petugas cannot POST to admin penimbangan store', function () {
    $petugas = User::factory()->petugas()->create();

    $response = $this
        ->actingAs($petugas)
        ->post('/admin/penimbangan', [
            'nama' => $petugas->name,
            'tanggal' => now()->format('Y-m-d H:i'),
            'berat_sampah' => 10,
            'area' => 'Lantai 1',
        ]);

    $response->assertForbidden();
});

test('petugas sees submitted data after form submission via Inertia', function () {
    $petugas = User::factory()->petugas()->create();

    $response = $this
        ->actingAs($petugas)
        ->from('/form/penimbangan')
        ->post('/petugas/penimbangan', [
            '_redirect' => '/form',
            'nama' => $petugas->name,
            'tanggal' => now()->format('Y-m-d H:i'),
            'berat_sampah' => 3.75,
            'area' => 'Lantai 3',
            'sub_area' => 'Kamar Kecil',
        ]);

    $response->assertRedirect('/form/penimbangan');

    $followResponse = $this
        ->actingAs($petugas)
        ->get('/form/penimbangan');

    $followResponse->assertInertia(fn (AssertableInertia $page) => $page
        ->component('form/penimbangan')
        ->where('submitted.berat_sampah', '3.75')
        ->where('submitted.area', 'Lantai 3')
        ->where('submitted.sub_area', 'Kamar Kecil')
        ->where('submitted.nama', $petugas->name)
    );
});
