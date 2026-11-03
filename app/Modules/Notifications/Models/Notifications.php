<?php

namespace App\Modules\Notifications\Models;

use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Notifications extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'type', 'message', 'read'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
