<?php

use App\Models\Penimbangan;
use App\Models\User;

beforeEach(function () {
    $this->petugasA = User::factory()->petugas()->create();
    $this->petugasB = User::factory()->petugas()->create();
    $this->admin = User::factory()->admin()->create();

    $this->recordA = Penimbangan::factory()->create([
        'user_id' => $this->petugasA->id,
        'nama' => $this->petugasA->name,
    ]);

    $this->recordB = Penimbangan::factory()->create([
        'user_id' => $this->petugasB->id,
        'nama' => $this->petugasB->name,
    ]);
});

test('petugas A can see records created by petugas A', function () {
    $this->actingAs($this->petugasA);

    $response = $this->get(route('petugas.penimbangan.index'));

    $response->assertInertia(fn ($page) => $page
        ->component('penimbangan/index')
        ->has('penimbangan', 1)
        ->where('penimbangan.0.id', $this->recordA->id)
    );
});

test('petugas A cannot see records created by petugas B', function () {
    $this->actingAs($this->petugasA);

    $response = $this->get(route('petugas.penimbangan.index'));

    $response->assertInertia(fn ($page) => $page
        ->component('penimbangan/index')
        ->has('penimbangan', 1)
        ->where('penimbangan.0.id', $this->recordA->id)
        ->missing('penimbangan.1')
    );
});

test('petugas A cannot open edit page for petugas B record', function () {
    $this->actingAs($this->petugasA);

    $response = $this->get(route('petugas.penimbangan.edit', $this->recordB->id));

    $response->assertForbidden();
});

test('petugas A cannot update petugas B record', function () {
    $this->actingAs($this->petugasA);

    $response = $this->put(route('petugas.penimbangan.update', $this->recordB->id), [
        'nama' => $this->petugasA->name,
        'tanggal' => now()->format('Y-m-d H:i'),
        'berat_sampah' => 50,
        'area' => 'Lantai 1',
    ]);

    $response->assertForbidden();
});

test('petugas A cannot delete petugas B record', function () {
    $this->actingAs($this->petugasA);

    $response = $this->delete(route('petugas.penimbangan.destroy', $this->recordB->id));

    $response->assertForbidden();
});

test('petugas A total weight only includes petugas A records', function () {
    $this->actingAs($this->petugasA);

    $response = $this->get(route('petugas.penimbangan.index'));

    $response->assertInertia(fn ($page) => $page
        ->component('penimbangan/index')
        ->has('penimbangan', 1)
    );
});

test('petugas A csv export only includes petugas A records', function () {
    $this->actingAs($this->petugasA);

    $response = $this->get(route('petugas.penimbangan.export'));

    $response->assertOk();
    $response->assertDownload();

    $content = $response->streamedContent();
    expect($content)->toContain($this->recordA->nama);
    expect($content)->not->toContain($this->recordB->nama);
});

test('admin can see all records', function () {
    $this->actingAs($this->admin);

    $response = $this->get(route('admin.penimbangan.index'));

    $response->assertInertia(fn ($page) => $page
        ->component('penimbangan/index')
        ->has('penimbangan', 2)
    );
});

test('admin can edit records created by any petugas', function () {
    $this->actingAs($this->admin);

    $response = $this->get(route('admin.penimbangan.edit', $this->recordA->id));

    $response->assertOk();
});

test('admin can update records created by any petugas', function () {
    $this->actingAs($this->admin);

    $response = $this->put(route('admin.penimbangan.update', $this->recordA->id), [
        'nama' => $this->petugasA->name,
        'tanggal' => now()->format('Y-m-d H:i'),
        'berat_sampah' => 100,
        'area' => 'Lantai 1',
    ]);

    $response->assertRedirect();
    expect($this->recordA->fresh()->berat_sampah)->toEqual(100.00);
});

test('admin can delete records created by any petugas', function () {
    $this->actingAs($this->admin);

    $response = $this->delete(route('admin.penimbangan.destroy', $this->recordA->id));

    $response->assertRedirect();
    expect(Penimbangan::find($this->recordA->id))->toBeNull();
});

test('newly created record is assigned to the authenticated user', function () {
    $this->actingAs($this->petugasA);

    $this->post(route('petugas.penimbangan.store'), [
        'nama' => $this->petugasA->name,
        'tanggal' => now()->format('Y-m-d H:i'),
        'berat_sampah' => 10,
        'area' => 'Lantai 1',
    ]);

    $record = Penimbangan::where('nama', $this->petugasA->name)->latest()->first();
    expect($record->user_id)->toBe($this->petugasA->id);
});

test('submitted fake user_id is ignored by the server', function () {
    $this->actingAs($this->petugasA);

    $this->post(route('petugas.penimbangan.store'), [
        'nama' => $this->petugasA->name,
        'tanggal' => now()->format('Y-m-d H:i'),
        'berat_sampah' => 10,
        'area' => 'Lantai 1',
        'user_id' => $this->petugasB->id,
    ]);

    $record = Penimbangan::where('nama', $this->petugasA->name)->latest()->first();
    expect($record->user_id)->toBe($this->petugasA->id);
    expect($record->user_id)->not->toBe($this->petugasB->id);
});
