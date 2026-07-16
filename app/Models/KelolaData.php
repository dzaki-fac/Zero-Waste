<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KelolaData extends Model
{
    protected $table = 'kelola_data';

    protected $fillable = ['key', 'value'];

    protected function casts(): array
    {
        return [
            'value' => 'array',
        ];
    }
}
