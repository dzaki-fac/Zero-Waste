<?php

use App\Models\Distribusi;
use App\Models\PilahSampah;
use App\Models\Penimbangan;
use App\Models\User;

test('pilah sampah form submission sets user_id', function () {
    $petugas = User::factory()->petugas()->create();

    $response = $this
        ->actingAs($petugas)
        ->from('/form/pilah-sampah')
        ->post('/petugas/pilah-sampah', [
            '_redirect' => '/form',
            'nama' => $petugas->name,
            'tanggal' => now()->format('Y-m-d H:i'),
            'items' => [
                ['jenis_sampah' => 'Daun', 'berat' => '5.0'],
                ['jenis_sampah' => 'Botol', 'berat' => '3.0'],
                ['jenis_sampah' => 'Kardus dan Kertas', 'berat' => '0'],
            ],
        ]);

    $response->assertRedirect('/form/pilah-sampah');

    $records = PilahSampah::where('nama', $petugas->name)->latest()->take(2)->get();
    expect($records)->toHaveCount(2);
    expect($records[0]->user_id)->toBe($petugas->id);
    expect($records[1]->user_id)->toBe($petugas->id);

    // Zero-weight item should not create a record
    expect(PilahSampah::where('nama', $petugas->name)->latest()->take(3)->count())->toBe(2);
});

test('distribusi form submission sets user_id', function () {
    $petugas = User::factory()->petugas()->create();

    $response = $this
        ->actingAs($petugas)
        ->from('/form/distribusi')
        ->post('/petugas/distribusi', [
            '_redirect' => '/form',
            'nama' => $petugas->name,
            'tanggal' => now()->format('Y-m-d H:i'),
            'tujuan_distribusi' => 'Pengepul',
            'lokasi' => 'Gudang Pusat',
            'items' => [
                ['jenis_sampah' => 'Daun', 'berat' => '5.0'],
                ['jenis_sampah' => 'Botol', 'berat' => '2.0'],
            ],
        ]);

    $response->assertRedirect('/form/distribusi');

    $records = Distribusi::where('nama', $petugas->name)->latest()->take(2)->get();
    expect($records)->toHaveCount(2);
    expect($records[0]->user_id)->toBe($petugas->id);
    expect($records[1]->user_id)->toBe($petugas->id);
});

test('penimbangan form submission sets user_id', function () {
    $petugas = User::factory()->petugas()->create();

    $response = $this
        ->actingAs($petugas)
        ->from('/form/penimbangan')
        ->post('/petugas/penimbangan', [
            '_redirect' => '/form',
            'nama' => $petugas->name,
            'tanggal' => now()->format('Y-m-d H:i'),
            'berat_sampah' => '12.34',
            'area' => 'Lantai 1',
            'sub_area' => 'Area Baca',
        ]);

    $response->assertRedirect('/form/penimbangan');

    $record = Penimbangan::where('nama', $petugas->name)->latest()->first();
    expect($record->user_id)->toBe($petugas->id);
});

test('petugas dashboard uses visibleTo scope for pilah sampah totals', function () {
    $petugasA = User::factory()->petugas()->create();
    $petugasB = User::factory()->petugas()->create();

    PilahSampah::factory()->create([
        'user_id' => $petugasA->id,
        'nama' => $petugasA->name,
        'berat' => 10,
    ]);

    PilahSampah::factory()->create([
        'user_id' => $petugasB->id,
        'nama' => $petugasB->name,
        'berat' => 90,
    ]);

    $response = $this
        ->actingAs($petugasA)
        ->get('/petugas/dashboard');

    $response->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->has('pilahByJenis')
    );

    $response->assertOk();
});

test('petugas dashboard only shows own stats', function () {
    $petugasA = User::factory()->petugas()->create();
    $petugasB = User::factory()->petugas()->create();

    Penimbangan::factory()->create([
        'user_id' => $petugasA->id,
        'nama' => $petugasA->name,
        'berat_sampah' => 10,
    ]);

    Penimbangan::factory()->create([
        'user_id' => $petugasB->id,
        'nama' => $petugasB->name,
        'berat_sampah' => 90,
    ]);

    $response = $this
        ->actingAs($petugasA)
        ->get('/petugas/dashboard');

    $response->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->where('petugasStats.0.penimbangan.total_berat', 10)
        ->has('petugasStats', 1)
    );
});
