<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', static function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('surname');
            $table->string('phone');
            $table->text('address')->nullable();
            $table->string('email');
            $table->bigInteger('region_id'); // Foreign key bağlantısı yapılabilir
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('status')->default('aktif');
            $table->string('remember_token', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->string('type')->default('user');
            $table->string('ref_code')->nullable();
            $table->unsignedBigInteger('referred_by')->nullable(); // Foreign key bağlantısı yapılabilir
            // 💥 Buraya eklendi!
            $table->enum('admin_request_status', ['bekliyor', 'onaylandı', 'reddedildi'])->nullable();

            /**
             * 🔥 BAYİ SİSTEMİ
             */

            // Bu user bayi mi?
            $table->boolean('is_dealer')->default(false);

            // Bayiye özel kod (sadece is_dealer = true ise dolu)
            $table->string('dealer_code')->nullable()->unique();

            // Bayi aktif / pasif
            $table->enum('dealer_status', ['active', 'passive'])->default('active');

            /**
             * 💰 KOMİSYON MANTIĞI
             */

            // Bu kullanıcı üzerinden gelen işler komisyonlu mu?
            $table->boolean('is_commissioned_user')->default(true);
            $table->decimal('budget', 12, 2)->default(0);
        });

        Schema::create('password_reset_tokens', static function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', static function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null'); // Foreign key bağlantısı
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Tabloyu geri alıyoruz
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
