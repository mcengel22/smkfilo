<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class GeneralHelper
{

    /**
     * Belirtilen model için veritabanında zaten mevcut olmadığından emin olarak benzersiz bir kod oluşturur.
     *
     * @param Model $model Benzersiz kodun oluşturulacağı model sınıfı.
     * @return string  Benzersiz bir kod dizesi.
     * @throws \InvalidArgumentException  Sağlanan sınıf Model sınıfının bir alt sınıfı değilse.
     */
    public static function generateUniqueCode($model)
    {
        if (!is_subclass_of($model, Model::class)) {
            throw new \InvalidArgumentException('The provided class must be a subclass of Model.');
        }

        do {
            $code = Str::upper(Str::random(8));
        } while ($model::where('code', $code)->exists());

        return $code;
    }


    /**
     * Verilen bir başlığı URL dostu bir slug'a dönüştürür.
     *
     * @param string $title Slug'a dönüştürülecek başlık.
     * @param Model|null $forModel Slug benzersizliğini sağlamak için model sınıfı ismi.
     * @return string Oluşturulan slug.
     * @throws \InvalidArgumentException Eğer verilen $title parametresi string değilse ya da $forModel parametresi Model sınıfının bir alt sınıfı değilse.
     */
    public static function toSlug($title, $forModel = null)
    {
        if (!is_string($title)) {
            throw new \InvalidArgumentException('The $title parameter must be a string.');
        }

        $slug = Str::slug($title);

        if ($forModel) {
            if (!is_subclass_of($forModel, Model::class)) {
                throw new \InvalidArgumentException('The $forModel parameter must be a subclass of Model.');
            }

            $i = 0;
            while ($forModel::where('slug', $slug)->exists()) {
                $slug = Str::slug($title) . '-' . Str::upper(Str::random(6));
                $i++;
            }
        }

        return $slug;
    }

    /**
     * Telefon numarasını temizler ve doğru formatta kaydeder.
     *
     * @param string $value Telefon numarası.
     * @return string Temizlenmiş telefon numarası.
     * @throws \InvalidArgumentException Eğer telefon numarası geçersizse.
     */
    public static function formatPhone($value)
    {
        // Telefon numarasındaki tüm rakam dışı karakterleri temizle
        $cleanedPhone = preg_replace('/\D/', '', $value);

        // Telefon numarasının başında 0 olup olmadığını kontrol et
        if (substr($cleanedPhone, 0, 1) !== '0') {
            throw new \InvalidArgumentException('Telefon numarası 0 ile başlamalı.');
        }

        // Telefon numarasının doğru formatta olduğundan emin ol (10 haneli olmalı)
        if (strlen($cleanedPhone) != 11) {
            throw new \InvalidArgumentException('Telefon numarası geçersiz formatta. Geçerli format: 0XXXXXXXXXX.');
        }

        return $cleanedPhone;
    }

    /**
     * Telefon numarasını 0506 029 29 19 formatında döndürür.
     *
     * @param string $value Telefon numarası.
     * @return string Biçimlendirilmiş telefon numarası.
     */
    public static function formatPhoneOutput($value)
    {
        // Telefon numarası 10 haneli olmalı
        if (strlen($value) == 10) {
            return substr($value, 0, 4) . ' ' . substr($value, 4, 3) . ' ' . substr($value, 7, 2) . ' ' . substr($value, 9, 2);
        }

        return $value;
    }
}
