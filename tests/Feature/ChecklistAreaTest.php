<?php

use App\Models\ChecklistPekerjaan;
use App\Models\MasterPekerjaan;
use App\Models\User;

test('kelola pekerjaan show page does not receive areas prop', function () {
    $admin = User::factory()->admin()->create();

    $response = $this
        ->actingAs($admin)
        ->get('/admin/kelola-pekerjaan');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('kelola-pekerjaan/index')
        ->missing('areas')
    );
});

test('checklist show page receives areas from kelola data', function () {
    $admin = User::factory()->admin()->create();
    $petugas = User::factory()->petugas()->create(['nip' => '123456789012345678']);

    $response = $this
        ->actingAs($admin)
        ->get('/admin/checklist-pekerjaan/' . $petugas->nip);

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('checklist-pekerjaan/show')
        ->has('areas')
        ->where('areaFilter', null)
    );
});

test('checklist page can receive area query parameter', function () {
    $admin = User::factory()->admin()->create();
    $petugas = User::factory()->petugas()->create(['nip' => '123456789012345678']);

    $response = $this
        ->actingAs($admin)
        ->get('/admin/checklist-pekerjaan/' . $petugas->nip . '?area=Lantai+1');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('checklist-pekerjaan/show')
        ->where('areaFilter', 'Lantai 1')
    );
});

test('all master tasks shown regardless of area filter', function () {
    $admin = User::factory()->admin()->create();
    $petugas = User::factory()->petugas()->create(['nip' => '123456789012345678']);

    MasterPekerjaan::create([
        'nama_pekerjaan' => 'Tugas Harian 1',
        'jenis_pekerjaan' => 'harian',
        'urutan' => 1,
    ]);
    MasterPekerjaan::create([
        'nama_pekerjaan' => 'Tugas Harian 2',
        'jenis_pekerjaan' => 'harian',
        'urutan' => 2,
    ]);

    $response = $this
        ->actingAs($admin)
        ->get('/admin/checklist-pekerjaan/' . $petugas->nip . '?area=Lantai+1');

    $response->assertInertia(fn ($page) => $page
        ->component('checklist-pekerjaan/show')
        ->has('masterTasks', 22)
        ->where('areaFilter', 'Lantai 1')
    );
});

test('store checklist uses area from request not from master pekerjaan', function () {
    $admin = User::factory()->admin()->create();
    $petugas = User::factory()->petugas()->create(['nip' => '123456789012345678']);

    $task = MasterPekerjaan::create([
        'nama_pekerjaan' => 'Sapu Lantai',
        'jenis_pekerjaan' => 'harian',
        'urutan' => 1,
    ]);

    $this
        ->actingAs($admin)
        ->post('/admin/checklist-pekerjaan', [
            'nip' => $petugas->nip,
            'tanggal' => now()->toDateString(),
            'area' => 'Lantai 3',
            'items' => [
                [
                    'master_pekerjaan_id' => $task->id,
                    'status' => 'sudah',
                ],
            ],
        ]);

    $checklist = ChecklistPekerjaan::where('nip', $petugas->nip)->first();
    expect($checklist)->not->toBeNull();
    expect($checklist->area)->toBe('Lantai 3');
    expect($checklist->tugas)->toBe('Sapu Lantai');
});

test('csv export includes area column', function () {
    $admin = User::factory()->admin()->create();
    $petugas = User::factory()->petugas()->create(['nip' => '123456789012345678']);

    $task = MasterPekerjaan::create([
        'nama_pekerjaan' => 'Sapu Lantai 1',
        'jenis_pekerjaan' => 'harian',
        'urutan' => 1,
    ]);

    ChecklistPekerjaan::create([
        'nip' => $petugas->nip,
        'tanggal' => now()->toDateString(),
        'tugas' => 'Sapu Lantai 1',
        'area' => 'Lantai 1',
        'jenis_pekerjaan' => 'harian',
        'master_pekerjaan_id' => $task->id,
        'status' => 'sudah',
    ]);

    $response = $this
        ->actingAs($admin)
        ->get('/admin/checklist-pekerjaan/export?nip=' . $petugas->nip);

    $response->assertOk();
    $content = $response->streamedContent();
    expect($content)->toContain('Area');
    expect($content)->toContain('Lantai 1');
});

test('csv export respects area filter', function () {
    $admin = User::factory()->admin()->create();
    $petugas = User::factory()->petugas()->create(['nip' => '123456789012345678']);

    $task = MasterPekerjaan::create([
        'nama_pekerjaan' => 'Sapu Lantai 1',
        'jenis_pekerjaan' => 'harian',
        'urutan' => 1,
    ]);

    ChecklistPekerjaan::create([
        'nip' => $petugas->nip,
        'tanggal' => now()->toDateString(),
        'tugas' => 'Sapu Lantai 1',
        'area' => 'Lantai 1',
        'jenis_pekerjaan' => 'harian',
        'master_pekerjaan_id' => $task->id,
        'status' => 'sudah',
    ]);

    ChecklistPekerjaan::create([
        'nip' => $petugas->nip,
        'tanggal' => now()->toDateString(),
        'tugas' => 'Sapu Lantai 2',
        'area' => 'Lantai 2',
        'jenis_pekerjaan' => 'harian',
        'master_pekerjaan_id' => $task->id,
        'status' => 'belum',
    ]);

    $response = $this
        ->actingAs($admin)
        ->get('/admin/checklist-pekerjaan/export?nip=' . $petugas->nip . '&area=Lantai+1');

    $response->assertOk();
    $content = $response->streamedContent();
    expect($content)->toContain('Lantai 1');
    expect($content)->not->toContain('Lantai 2');
});
