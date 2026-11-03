<?php

namespace App\Modules\Notifications\Models;


use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Model;

class NotificationPreferences extends Model
{
    // İzin verilen sütunlar
    protected $fillable = [
        'user_id',
        'email_notifications', // E-posta bildirim izni
        'sms_notifications',   // SMS bildirim izni
        'push_notifications',  // Push bildirim izni
    ];

    /**
     * User ilişkisi (Bir kullanıcının tercihlerine bağlıdır)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
