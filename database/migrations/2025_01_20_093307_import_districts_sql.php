<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

class ImportDistrictsSql extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $path = database_path('sql/Districts.sql');

        // Dosya var mı kontrol et
        if (!File::exists($path)) {
            throw new \Exception("SQL dosyası bulunamadı: {$path}");
        }

        try {
            // Dosyayı al ve SQL sorgularını çalıştır
            $sql = File::get($path);
            DB::unprepared($sql); // SQL sorgusunu çalıştır
        } catch (\Exception $e) {
            // Hata durumu
            throw new \Exception("Districts.sql dosyası çalıştırılırken hata oluştu: " . $e->getMessage());
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasTable('districts')) {
            // Tabloyu kontrol et ve verileri temizle
            DB::table('districts')->delete(); // TRUNCATE yerine DELETE kullan
        }
    }
}
