<?php

namespace App\Providers;

use App\Models\Distribusi;
use App\Models\Penimbangan;
use App\Models\PilahSampah;
use App\Policies\DistribusiPolicy;
use App\Policies\PenimbanganPolicy;
use App\Policies\PilahSampahPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Penimbangan::class => PenimbanganPolicy::class,
        PilahSampah::class => PilahSampahPolicy::class,
        Distribusi::class => DistribusiPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
