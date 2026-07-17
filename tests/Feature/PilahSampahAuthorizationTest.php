<?php

use App\Models\PilahSampah;
use App\Models\User;

beforeEach(function () {
    $this->petugasA = User::factory()->petugas()->create();
    $this->petugasB = User::factory()->petugas()->create();
    $this->admin = User::factory()->admin()->create();

    $this->recordA = PilahSampah::factory()->create([
        'user_id' => $this->petugasA->id,
        'nama' => $this->petugasA->name,
    ]);

    $this->recordB = PilahSampah::factory()->create([
        'user_id' => $this->petugasB->id,
        'nama' => $this->petugasB->name,
    ]);
});

test('petugas A can see records created by petugas A', function () {
    $this->actingAs($this->petugasA);

    $response = $this->get(route('petugas.pilah-sampah.index'));

    $response->assertInertia(fn ($page) => $page
        ->component('pilah-sampah/index')
        ->has('pilahSampah', 1)
        ->where('pilahSampah.0.id', $this->recordA->id)
    );
});

test('petugas A cannot see records created by petugas B', function () {
    $this->actingAs($this->petugasA);

    $response = $this->get(route('petugas.pilah-sampah.index'));

    $response->assertInertia(fn ($page) => $page
        ->component('pilah-sampah/index')
        ->has('pilahSampah', 1)
        ->where('pilahSampah.0.id', $this->recordA->id)
    );
});

test('petugas A cannot open edit page for petugas B record', function () {
    $this->actingAs($this->petugasA);

    $response = $this->get(route('petugas.pilah-sampah.edit', $this->recordB->id));

    $response->assertForbidden();
});

test('petugas A cannot update petugas B record', function () {
    $this->actingAs($this->petugasA);

    $response = $this->put(route('petugas.pilah-sampah.update', $this->recordB->id), [
        'nama' => $this->petugasA->name,
        'tanggal' => now()->format('Y-m-d H:i'),
        'berat' => 50,
        'jenis_sampah' => 'Daun',
    ]);

    $response->assertForbidden();
});

test('petugas A cannot delete petugas B record', function () {
    $this->actingAs($this->petugasA);

    $response = $this->delete(route('petugas.pilah-sampah.destroy', $this->recordB->id));

    $response->assertForbidden();
});

test('petugas A csv export only includes petugas A records', function () {
    $this->actingAs($this->petugasA);

    $response = $this->get(route('petugas.pilah-sampah.export'));

    $response->assertOk();
    $content = $response->streamedContent();
    expect($content)->toContain($this->recordA->nama);
    expect($content)->not->toContain($this->recordB->nama);
});

test('admin can see all records', function () {
    $this->actingAs($this->admin);

    $response = $this->get(route('admin.pilah-sampah.index'));

    $response->assertInertia(fn ($page) => $page
        ->component('pilah-sampah/index')
        ->has('pilahSampah', 2)
    );
});

test('admin can edit records created by any petugas', function () {
    $this->actingAs($this->admin);

    $response = $this->get(route('admin.pilah-sampah.edit', $this->recordA->id));

    $response->assertOk();
});

test('admin can update records created by any petugas', function () {
    $this->actingAs($this->admin);

    $response = $this->put(route('admin.pilah-sampah.update', $this->recordA->id), [
        'nama' => $this->petugasA->name,
        'tanggal' => now()->format('Y-m-d H:i'),
        'berat' => 100,
        'jenis_sampah' => 'Daun',
    ]);

    $response->assertRedirect();
    expect($this->recordA->fresh()->berat)->toEqual(100.00);
});

test('admin can delete records created by any petugas', function () {
    $this->actingAs($this->admin);

    $response = $this->delete(route('admin.pilah-sampah.destroy', $this->recordA->id));

    $response->assertRedirect();
    expect(PilahSampah::find($this->recordA->id))->toBeNull();
});

test('newly created pilah record is assigned to the authenticated user', function () {
    $this->actingAs($this->petugasA);

    $this->post(route('petugas.pilah-sampah.store'), [
        'nama' => $this->petugasA->name,
        'tanggal' => now()->format('Y-m-d H:i'),
        'berat' => 10,
        'jenis_sampah' => 'Daun',
    ]);

    $record = PilahSampah::where('nama', $this->petugasA->name)->latest()->first();
    expect($record->user_id)->toBe($this->petugasA->id);
});

test('submitted fake user_id is ignored in pilah record', function () {
    $this->actingAs($this->petugasA);

    $this->post(route('petugas.pilah-sampah.store'), [
        'nama' => $this->petugasA->name,
        'tanggal' => now()->format('Y-m-d H:i'),
        'berat' => 10,
        'jenis_sampah' => 'Daun',
        'user_id' => $this->petugasB->id,
    ]);

    $record = PilahSampah::where('nama', $this->petugasA->name)->latest()->first();
    expect($record->user_id)->toBe($this->petugasA->id);
});
