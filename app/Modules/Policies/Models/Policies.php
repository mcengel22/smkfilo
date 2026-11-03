<?php

namespace App\Modules\Policies\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Policies extends Model
{
    use SoftDeletes;

    protected $table = 'policies';

    protected $fillable = ['name', 'type', 'content'];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
