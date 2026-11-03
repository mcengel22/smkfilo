<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

class ImportCitiesSql extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $path = database_path('sql/Cities.sql'); // Dosya yolu kontrolü

        // Dosyanın varlığını kontrol et
        if (File::exists($path)) {
            $sql = File::get($path);

            DB::unprepared($sql); // SQL dosyasını çalıştır
        } else {
            // Hata mesajı log'la ya da gerekli bir işlem yap
            throw new \Exception("SQL dosyası bulunamadı: {$path}");
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasTable('cities')) {
            // Eğer tablo varsa, verileri sil
            DB::table('cities')->delete();
        }
    }
}
