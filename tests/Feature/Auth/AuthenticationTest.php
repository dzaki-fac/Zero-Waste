<?php

use App\Models\User;
use Illuminate\Support\Facades\RateLimiter;
use Laravel\Fortify\Features;

test('login screen can be rendered', function () {
    $response = $this->get(route('login'));

    $response->assertOk();
});

test('users can authenticate using the login screen', function () {
    $user = User::factory()->create();

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('petugas.form', absolute: false));
});

test('users with two factor enabled are redirected to two factor challenge', function () {
    $this->skipUnlessFortifyHas(Features::twoFactorAuthentication());

    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]);

    $user = User::factory()->withTwoFactor()->create();

    $response = $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertRedirect(route('two-factor.login'));
    $response->assertSessionHas('login.id', $user->id);
    $this->assertGuest();
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('logout'));

    $response->assertRedirect('/login');

    $this->assertGuest();
});

test('authenticated admin can logout', function () {
    $user = User::factory()->admin()->create();

    $response = $this->actingAs($user)->post(route('logout'));

    $response->assertRedirect('/login');
    $this->assertGuest();
});

test('authenticated petugas can logout', function () {
    $user = User::factory()->petugas()->create();

    $response = $this->actingAs($user)->post(route('logout'));

    $response->assertRedirect('/login');
    $this->assertGuest();
});

test('logout invalidates session and regenerates token', function () {
    $user = User::factory()->create();

    $this->actingAs($user);

    $sessionBefore = session()->getId();

    $this->post(route('logout'));

    $this->assertGuest();
    $this->assertNotEquals($sessionBefore, session()->getId());
});

test('GET request to logout route is not accepted', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('logout'));

    $response->assertStatus(405);
});

test('after logout /form redirects to login', function () {
    $user = User::factory()->petugas()->create();

    $this->actingAs($user)->post(route('logout'));

    $response = $this->get(route('petugas.form'));
    $response->assertRedirect(route('login'));
});

test('after logout /admin/dashboard redirects to login', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)->post(route('logout'));

    $response = $this->get(route('admin.dashboard'));
    $response->assertRedirect(route('login'));
});

test('after logout /petugas/penimbangan redirects to login', function () {
    $user = User::factory()->petugas()->create();

    $this->actingAs($user)->post(route('logout'));

    $response = $this->get(route('petugas.penimbangan.index'));
    $response->assertRedirect(route('login'));
});

test('users are rate limited', function () {
    $user = User::factory()->create();

    RateLimiter::increment(md5('login'.implode('|', [$user->email, '127.0.0.1'])), amount: 5);

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $response->assertTooManyRequests();
});