<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class MediaService
{
    private ImageManager $imageManager;

    // Kalite 90 → 72: gözle fark edilmez, boyut ~%40-50 düşer
    private const DEFAULT_QUALITY = 72;

    // Kart/cover görselleri için max genişlik (px)
    // 1200px üzeri ekranda zaten 350px genişlikte gösteriliyor
    private const MAX_WIDTH  = 1200;
    private const MAX_HEIGHT = 900;

    public function __construct()
    {
        $this->imageManager = new ImageManager(new Driver());
    }

    /**
     * Dosyayı yükler, webp'e çevirir, boyutunu sınırlar.
     */
    public function upload(
        UploadedFile $file,
        string       $name,
        string       $directory = 'uploads',
        int          $quality = self::DEFAULT_QUALITY,
        string       $disk = 'public'
    ): string {
        $fileName = Str::slug($name) . '-' . uniqid() . '.webp';
        $path     = $directory . '/' . $fileName;

        $image = $this->imageManager->read($file);

        // Gereksiz büyük görselleri küçült (oranı koru)
        if ($image->width() > self::MAX_WIDTH || $image->height() > self::MAX_HEIGHT) {
            $image->scaleDown(self::MAX_WIDTH, self::MAX_HEIGHT);
        }

        Storage::disk($disk)->put($path, $image->toWebp($quality));

        return '/storage/' . $path;
    }

    /**
     * Uzak URL'den indirir, sıkıştırarak kaydeder.
     */
    public function downloadAndSave(
        string $url,
        string $name,
        string $directory = 'uploads',
        int    $quality = self::DEFAULT_QUALITY,
        string $disk = 'public'
    ): string {
        $fileName = Str::slug($name) . '-' . uniqid() . '.webp';
        $path     = $directory . '/' . $fileName;

        $image = $this->imageManager->read(file_get_contents($url));

        if ($image->width() > self::MAX_WIDTH || $image->height() > self::MAX_HEIGHT) {
            $image->scaleDown(self::MAX_WIDTH, self::MAX_HEIGHT);
        }

        Storage::disk($disk)->put($path, $image->toWebp($quality));

        return '/storage/' . $path;
    }

    /**
     * Boyutlandırarak yükler.
     */
    public function resize(
        UploadedFile $file,
        int          $width,
        int          $height,
        string       $name,
        string       $directory = 'uploads',
        int          $quality = self::DEFAULT_QUALITY,
        string       $disk = 'public'
    ): string {
        $fileName = Str::slug($name) . '-' . uniqid() . '.webp';
        $path     = $directory . '/' . $fileName;

        $image = $this->imageManager->read($file)
            ->resize($width, $height)
            ->toWebp($quality);

        Storage::disk($disk)->put($path, $image);

        return '/storage/' . $path;
    }

    /**
     * Dosyayı siler.
     */
    public function delete(string $path, string $disk = 'public'): bool
    {
        if (Storage::disk($disk)->exists($path)) {
            return Storage::disk($disk)->delete($path);
        }

        return false;
    }

    /**
     * Mevcut storage'daki tüm görselleri yeniden sıkıştırır.
     * Tek seferlik çalıştır: php artisan tinker → app(MediaService::class)->recompressAll()
     */
    public function recompressAll(
        string $directory = 'media',
        int    $quality = self::DEFAULT_QUALITY,
        string $disk = 'public'
    ): array {
        $files  = Storage::disk($disk)->allFiles($directory);
        $report = ['processed' => 0, 'skipped' => 0, 'saved_kb' => 0];

        foreach ($files as $file) {
            if (!preg_match('/\.(webp|jpg|jpeg|png)$/i', $file)) {
                $report['skipped']++;
                continue;
            }

            try {
                $fullPath   = Storage::disk($disk)->path($file);
                $beforeSize = filesize($fullPath);

                $image = $this->imageManager->read($fullPath);

                if ($image->width() > self::MAX_WIDTH || $image->height() > self::MAX_HEIGHT) {
                    $image->scaleDown(self::MAX_WIDTH, self::MAX_HEIGHT);
                }

                Storage::disk($disk)->put($file, $image->toWebp($quality));

                $afterSize = filesize($fullPath);
                $report['saved_kb']  += round(($beforeSize - $afterSize) / 1024, 1);
                $report['processed']++;
            } catch (\Throwable $e) {
                $report['skipped']++;
            }
        }

        return $report;
    }
}
