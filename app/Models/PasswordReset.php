<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PasswordReset extends Model
{
    protected $table = 'password_reset_tokens';

    // Eğer 'email' primary key olacaksa:
    protected $primaryKey = 'email';

    // 'timestamps' varsayılan olarak true, ama sadece 'created_at' kullanacaksan ve 'updated_at' gerekmezse
    public $timestamps = false;

    protected $fillable = ['email', 'token', 'created_at'];
}
