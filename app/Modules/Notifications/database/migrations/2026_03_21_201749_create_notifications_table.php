<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Bildirimi alan kişi
            $table->string('type'); // email, sms, push, database gibi
            $table->text('message'); // Bildirimin içeriği
            $table->boolean('read')->default(false); // Okundu mu?
            $table->timestamps();
        });

        Schema::create('notification_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');  // Kullanıcıyı bağlayalım
            $table->boolean('email_notifications')->default(true);  // Mail bildirim izni
            $table->boolean('sms_notifications')->default(true);    // SMS bildirim izni
            $table->boolean('push_notifications')->default(true);   // Push bildirim izni
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('notification_preferences');
    }
};
