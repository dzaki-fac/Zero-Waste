<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->columns = Schema::getColumnListing('users');
});

test('users table has nip and role columns', function () {
    expect($this->columns)->toContain('nip', 'role');
});

test('nip column is nullable', function () {
    $user = User::factory()->create(['nip' => null]);

    expect($user->nip)->toBeNull();
});

test('default role is petugas', function () {
    $user = User::factory()->create();

    expect($user->role)->toBe('petugas');
});

test('role accepts admin', function () {
    $user = User::factory()->admin()->create();

    expect($user->role)->toBe('admin');
});

test('role accepts petugas', function () {
    $user = User::factory()->petugas()->create();

    expect($user->role)->toBe('petugas');
});

test('duplicate nip is rejected', function () {
    $nip = '123456789012345678';
    User::factory()->create(['nip' => $nip]);

    expect(fn () => User::factory()->create(['nip' => $nip]))
        ->toThrow(\Illuminate\Database\QueryException::class);
});

test('migration can be rolled back', function () {
    $migration = require database_path('migrations/2026_07_14_042507_add_nip_and_role_to_users_table.php');
    $migration->down();

    $columns = Schema::getColumnListing('users');
    expect($columns)->not->toContain('nip', 'role');

    $migration->up();

    $columns = Schema::getColumnListing('users');
    expect($columns)->toContain('nip', 'role');
});
