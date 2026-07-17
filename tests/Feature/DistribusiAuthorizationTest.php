<?php

use App\Models\Distribusi;
use App\Models\User;

beforeEach(function () {
    $this->petugasA = User::factory()->petugas()->create();
    $this->petugasB = User::factory()->petugas()->create();
    $this->admin = User::factory()->admin()->create();

    $this->recordA = Distribusi::factory()->create([
        'user_id' => $this->petugasA->id,
        'nama' => $this->petugasA->name,
    ]);

    $this->recordB = Distribusi::factory()->create([
        'user_id' => $this->petugasB->id,
        'nama' => $this->petugasB->name,
    ]);
});

test('petugas A can see records created by petugas A', function () {
    $this->actingAs($this->petugasA);

    $response = $this->get(route('petugas.distribusi.index'));

    $response->assertInertia(fn ($page) => $page
        ->component('distribusi/index')
        ->has('distribusi', 1)
        ->where('distribusi.0.id', $this->recordA->id)
    );
});

test('petugas A cannot see records created by petugas B', function () {
    $this->actingAs($this->petugasA);

    $response = $this->get(route('petugas.distribusi.index'));

    $response->assertInertia(fn ($page) => $page
        ->component('distribusi/index')
        ->has('distribusi', 1)
        ->where('distribusi.0.id', $this->recordA->id)
    );
});

test('petugas A cannot open edit page for petugas B record', function () {
    $this->actingAs($this->petugasA);

    $response = $this->get(route('petugas.distribusi.edit', $this->recordB->id));

    $response->assertForbidden();
});

test('petugas A cannot update petugas B record', function () {
    $this->actingAs($this->petugasA);

    $response = $this->put(route('petugas.distribusi.update', $this->recordB->id), [
        'nama' => $this->petugasA->name,
        'tanggal' => now()->format('Y-m-d H:i'),
        'berat' => 50,
        'jenis_sampah' => 'Daun',
        'tujuan_distribusi' => 'TPS',
        'lokasi' => 'Lokasi A',
    ]);

    $response->assertForbidden();
});

test('petugas A cannot delete petugas B record', function () {
    $this->actingAs($this->petugasA);

    $response = $this->delete(route('petugas.distribusi.destroy', $this->recordB->id));

    $response->assertForbidden();
});

test('petugas A csv export only includes petugas A records', function () {
    $this->actingAs($this->petugasA);

    $response = $this->get(route('petugas.distribusi.export'));

    $response->assertOk();
    $content = $response->streamedContent();
    expect($content)->toContain($this->recordA->nama);
    expect($content)->not->toContain($this->recordB->nama);
});

test('admin can see all distribusi records', function () {
    $this->actingAs($this->admin);

    $response = $this->get(route('admin.distribusi.index'));

    $response->assertInertia(fn ($page) => $page
        ->component('distribusi/index')
        ->has('distribusi', 2)
    );
});

test('admin can edit distribusi records created by any petugas', function () {
    $this->actingAs($this->admin);

    $response = $this->get(route('admin.distribusi.edit', $this->recordA->id));

    $response->assertOk();
});

test('admin can update distribusi records created by any petugas', function () {
    $this->actingAs($this->admin);

    $response = $this->put(route('admin.distribusi.update', $this->recordA->id), [
        'nama' => $this->petugasA->name,
        'tanggal' => now()->format('Y-m-d H:i'),
        'berat' => 100,
        'jenis_sampah' => 'Daun',
        'tujuan_distribusi' => 'TPS',
        'lokasi' => 'Lokasi A',
    ]);

    $response->assertRedirect();
    expect($this->recordA->fresh()->berat)->toEqual(100.00);
});

test('admin can delete distribusi records created by any petugas', function () {
    $this->actingAs($this->admin);

    $response = $this->delete(route('admin.distribusi.destroy', $this->recordA->id));

    $response->assertRedirect();
    expect(Distribusi::find($this->recordA->id))->toBeNull();
});

test('newly created distribusi record is assigned to the authenticated user', function () {
    $this->actingAs($this->petugasA);

    $this->post(route('petugas.distribusi.store'), [
        'nama' => $this->petugasA->name,
        'tanggal' => now()->format('Y-m-d H:i'),
        'berat' => 10,
        'jenis_sampah' => 'Daun',
        'tujuan_distribusi' => 'TPS',
        'lokasi' => 'Lokasi A',
    ]);

    $record = Distribusi::where('nama', $this->petugasA->name)->latest()->first();
    expect($record->user_id)->toBe($this->petugasA->id);
});

test('submitted fake user_id is ignored in distribusi record', function () {
    $this->actingAs($this->petugasA);

    $this->post(route('petugas.distribusi.store'), [
        'nama' => $this->petugasA->name,
        'tanggal' => now()->format('Y-m-d H:i'),
        'berat' => 10,
        'jenis_sampah' => 'Daun',
        'tujuan_distribusi' => 'TPS',
        'lokasi' => 'Lokasi A',
        'user_id' => $this->petugasB->id,
    ]);

    $record = Distribusi::where('nama', $this->petugasA->name)->latest()->first();
    expect($record->user_id)->toBe($this->petugasA->id);
});
