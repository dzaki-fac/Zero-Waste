<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Area extends Model
{
    protected $fillable = ['name', 'description', 'sort_order', 'is_active'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function subAreas(): HasMany
    {
        return $this->hasMany(SubArea::class);
    }

    public function areaReviews(): HasMany
    {
        return $this->hasMany(AreaReview::class);
    }
}
