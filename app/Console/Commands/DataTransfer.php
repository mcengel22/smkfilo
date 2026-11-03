<?php

namespace App\Console\Commands;

use App\Enums\PostType;
use App\Helpers\GeneralHelper;
use App\Models\Region;
use App\Modules\Attr\Models\Attr;
use App\Modules\Media\Repositories\MediaRepository;
use App\Modules\PostHasAttr\Models\PostHasAttr;
use App\Modules\Reservation\Models\Reservation;
use App\Modules\Post\Repositories\{
    PostDetailRepository,
    PostGalleryImageRepository,
    PostGalleryRepository,
    PostPricesRepository,
    PostRepository
};
use App\Services\MediaService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DataTransfer extends Command
{
    protected $signature = 'data:transfer';
    protected $description = 'Villa verilerini eski sistemden yeniye aktarır';

    private $remotePost;
    private $post;
    private $mediaService;
    private $mediaRepo;
    private $postDetailRepo;
    private $postPriceRepo;
    private $postGalleryRepo;
    private $postGalleryImageRepo;

    public function __construct()
    {
        parent::__construct();
        $this->mediaService = new MediaService();
        $this->mediaRepo = new MediaRepository();
        $this->postDetailRepo = new PostDetailRepository();
        $this->postPriceRepo = new PostPricesRepository();
        $this->postGalleryRepo = new PostGalleryRepository();
        $this->postGalleryImageRepo = new PostGalleryImageRepository();
    }

    public function handle()
    {
        try {
            $this->info('Veri transfer işlemi başlatılıyor...');

            DB::connection('remote_mysql')
                ->table('villas')
                ->orderBy('id')
                ->chunk(100, function ($veriler) {
                    $this->processVillas($veriler);
                });

            $this->info('✓ Veri transferi başarıyla tamamlandı!');
            return 0;

        } catch (\Exception $e) {
            $this->error('Kritik Hata: ' . $e->getMessage());
            return 1;
        }
    }

    private function processVillas($veriler)
    {
        foreach ($veriler as $villa) {
            DB::beginTransaction();
            try {
                $this->info("İlan ID: {$villa->id} işleniyor...");

                $this->remotePost = $villa;

                $this->info('1/8 - Temel ilan bilgileri aktarılıyor...');
                $post = $this->createPost($villa);
                $this->post = $post;
                $this->info('✓ Temel ilan bilgileri aktarıldı.');

                $this->info('2/8 - Kapak fotoğrafı aktarılıyor...');
                if ($villa->cover_image) {
                    $this->uploadCoverImage($villa);
                    $this->info('✓ Kapak fotoğrafı aktarıldı.');
                }

                $this->info('3/8 - Detay bilgileri aktarılıyor...');
                $this->transferDetails($villa->id);
                $this->info('✓ Detay bilgileri aktarıldı.');

                $this->info('4/8 - Fiyat bilgileri aktarılıyor...');
                $this->transferPricing($villa->id);
                $this->info('✓ Fiyat bilgileri aktarıldı.');

                $this->info('5/8 - Galeri aktarılıyor...');
                $this->transferGallery($villa->id);
                $this->info('✓ Galeri aktarıldı.');

                $this->info('6/8 - Özellikler aktarılıyor...');
                $this->transferFeatures($villa->id);
                $this->info('✓ Özellikler aktarıldı.');

                $this->info('7/8 - Kural ve servisler aktarılıyor...');
                $this->transferRulesAndServices($villa->id);
                $this->info('✓ Kural ve servisler aktarıldı.');

                $this->info('8/8 - Rezervasyonlar aktarılıyor...');
                $this->transferReservationAndReservationDetail($villa->id);
                $this->info('✓ Rezervasyonlar aktarıldı.');

                DB::commit();
                $this->info("✓✓✓ İlan ID: {$villa->id} başarıyla aktarıldı.");
                $this->newLine();

            } catch (\Exception $e) {
                DB::rollBack();
                $this->error("İlan ID: {$villa->id} aktarımında hata: " . $e->getMessage());
                continue;
            }
        }
    }

    private function transferReservationAndReservationDetail($villa_id)
    {
        $remoteReservations = DB::connection('remote_mysql')
            ->table('reservations')
            ->where('related_id', $villa_id)
            ->get();

        if (!$remoteReservations->count()) {
            return;
        }

        foreach ($remoteReservations as $remoteReservation) {
            try {
                // Rezervasyon oluştur
                $reservation = DB::table('reservations')->insertGetId([
                    'reservable_type' => 'App\Modules\User\Models\User', // Varsayılan olarak User
                    'reservable_id' => 1, // Varsayılan kullanıcı
                    'post_id' => $this->post->id,
                    'price' => $remoteReservation->total_price,
                    'start_date' => $remoteReservation->start_date,
                    'end_date' => $remoteReservation->end_date,
                    'status' => $this->mapReservationStatus($remoteReservation->status),
                    'code' => $remoteReservation->code ?? GeneralHelper::generateUniqueCode(Reservation::class)
                ]);

                // Rezervasyon detaylarını al
                $remoteDetails = DB::connection('remote_mysql')
                    ->table('reservation_details')
                    ->where('reservation_id', $remoteReservation->id)
                    ->first();

                // Rezervasyon detaylarını oluştur
                if ($remoteDetails) {
                    DB::table('reservation_details')->insert([
                        'reservation_id' => $reservation,
                        'adults' => $remoteDetails->adult_count ?? 1,
                        'children' => $remoteDetails->child_count ?? 0,
                        'infants' => $remoteDetails->infant_count ?? 0,
                        'cleaning_fee' => $remoteReservation->cleaning_fee ?? 0, // Eski tablodaki değer
                        'deposit' => $remoteReservation->deposit ?? 0, // Eski tablodaki değer
                        'note' => $remoteDetails->special_requests ?? null,
                    ]);
                } else {
                    // Detay yoksa varsayılan değerlerle oluştur
                    DB::table('reservation_details')->insert([
                        'reservation_id' => $reservation,
                        'adults' => 2,
                        'children' => 0,
                        'infants' => 0,
                        'cleaning_fee' => $remoteReservation->cleaning_fee ?? 0,
                        'deposit' => $remoteReservation->deposit ?? 0
                    ]);
                }

            } catch (\Exception $e) {
                \Log::error("Rezervasyon transfer hatası: Villa ID: $villa_id, Hata: " . $e->getMessage());
                continue;
            }
        }
    }

    private function mapReservationStatus($oldStatus)
    {
        // Eski statü değerlerini yeni ReservationStatus enum değerlerine eşle
        $statusMap = [
            'pending' => 'pending',
            'confirmed' => 'confirmed',
            'cancelled' => 'cancelled',
            // Diğer statü eşleştirmeleri eklenebilir
        ];

        return $statusMap[$oldStatus] ?? 'pending';
    }

    private function createPost($villa)
    {
        $repo = new PostRepository();
        $regionId = $this->getRegionId($villa);

        return $repo->create([
            'title' => $villa->name,
            'description' => $villa->description,
            'code' => $villa->listing_number,
            'neighborhood' => $villa->neighborhood,
            'status' => $villa->status,
            'user_id' => 1,
            'lat' => $villa->lat,
            'lng' => $villa->lng,
            'region_id' => $regionId,
            'type' => 'villa'
        ]);
    }

    private function uploadCoverImage($villa)
    {
        $fileUri = "https://api.tatilmerasi.com/" . $villa->cover_image;
        $fileName = explode('/', $villa->cover_image);
        $fileName = end($fileName);

        $imagePath = $this->mediaService->downloadAndSave(
            $fileUri,
            $fileName,
            "posts/{$this->post->id}/cover"
        );

        $media = $this->mediaRepo->create([
            'url' => $imagePath,
            'title' => $fileName,
            'alt' => $fileName,
            'user_id' => 1,
        ]);

        $repo = new PostRepository();
        $repo->update($this->post->slug, ['cover' => $media->id]);
    }

    private function transferDetails($villaId)
    {
        $postDetails = DB::connection('remote_mysql')
            ->table('villa_details')
            ->where('villa_id', $villaId)
            ->first();

        if (!$postDetails) {
            return;
        }

        $detailData = $this->prepareDetailData($postDetails);

        foreach ($detailData as $detail) {
            $this->postDetailRepo->create($detail);
        }
    }

    private function prepareDetailData($details)
    {
        return [
            [
                "post_id" => $this->post->id,
                "key" => 'tursab_no',
                "value" => $this->remotePost->tursab_no,
            ],
            [
                "post_id" => $this->post->id,
                "key" => 'm2',
                "value" => $details->m2,
            ],
            [
                "post_id" => $this->post->id,
                "key" => 'room_count',
                "value" => $details->room_count,
            ],
            [
                "post_id" => $this->post->id,
                "key" => 'bathroom_count',
                "value" => $details->bathroom_count,
            ],
            [
                "post_id" => $this->post->id,
                "key" => 'bed_count',
                "value" => $details->bed_count,
            ],
            [
                "post_id" => $this->post->id,
                "key" => 'people_count',
                "value" => $details->capacity,
            ],
            [
                "post_id" => $this->post->id,
                "key" => 'adult_count',
                "value" => $details->adult_count,
            ],
            [
                "post_id" => $this->post->id,
                "key" => 'child_count',
                "value" => $details->child_count,
            ],
            [
                "post_id" => $this->post->id,
                "key" => 'baby_count',
                "value" => $details->infant_count,
            ],
            [
                "post_id" => $this->post->id,
                "key" => 'pool_size',
                "value" => $details->pool_size,
            ],
            [
                "post_id" => $this->post->id,
                "key" => 'check_in',
                "value" => $details->check_in_time,
            ],
            [
                "post_id" => $this->post->id,
                "key" => 'check_out',
                "value" => $details->check_out_time,
            ],
            [
                "post_id" => $this->post->id,
                "key" => 'deposit',
                "value" => $details->damage_deposit,
            ],
            [
                "post_id" => $this->post->id,
                "key" => 'prepayment',
                "value" => $details->prepayment_percentage,
            ],
            [
                "post_id" => $this->post->id,
                "key" => 'cleaning_fee',
                "value" => $details->cleaning_fee,
            ],
            [
                "post_id" => $this->post->id,
                "key" => 'cleaning_fee_days',
                "value" => $details->cleaning_fee_days,
            ]
        ];
    }
    private function transferPricing($villaId)
    {
        $prices = DB::connection('remote_mysql')
            ->table('villa_prices')
            ->where('villa_id', $villaId)
            ->get();

        foreach ($prices as $price) {
            $this->postPriceRepo->create([
                'post_id' => $this->post->id,
                'start_date' => $price->start_date,
                'end_date' => $price->end_date,
                'min_days' => $price->minday,
                'price' => $price->price,
            ]);
        }
    }

    private function transferGallery($villaId)
    {
        $galleries = DB::connection('remote_mysql')
            ->table('villa_galleries')
            ->where('villa_id', $villaId)
            ->get();

        foreach ($galleries as $gallery) {
            $postGallery = $this->postGalleryRepo->create([
                "post_id" => $this->post->id,
                "title" => $gallery->value,
            ]);

            $this->processGalleryImages($gallery, $postGallery);
        }
    }

    private function processGalleryImages($gallery, $postGallery)
    {
        $raw   = $gallery->images;
        $items = json_decode($raw, true);

        if (!is_array($items)) {
            // Escape edilmiş slash’ları temizle, tırnakları kırp, virgülle parçala
            $clean = str_replace('\/', '/', trim($raw, '"'));
            $items = array_filter(array_map('trim', explode(',', $clean)));
        }

        $oldBase = 'https://api.tatilmerasi.com';

        foreach ($items as $path) {
            // Tam URL değilse base ile tamamla
            $fileUri = Str::startsWith($path, ['http://','https://'])
                ? $path
                : rtrim($oldBase, '/') . '/' . ltrim($path, '/');

            try {
                $fileName = Str::slug($gallery->value);

                $imagePath = $this->mediaService->downloadAndSave(
                    $fileUri,
                    $fileName,
                    "posts/{$this->post->id}/gallery"
                );

                $media = $this->mediaRepo->create([
                    'url'     => $imagePath,
                    'title'   => $fileName,
                    'alt'     => $fileName,
                    'user_id' => 1,
                ]);

                $this->postGalleryImageRepo->create([
                    'gallery_id' => $postGallery->id,
                    'media_id'   => $media->id,
                ]);

            } catch (\Exception $e) {
                $this->info("Resim aktarılamadı: {$fileUri}");
                // dilersen buraya $e->getMessage() da ekleyebilirsin
                continue;
            }
        }
    }




    private function createPostHasAttr($attr_id,$value)
    {
        $postHasAttr = PostHasAttr::updateOrCreate([
            "post_id" => $this->post->id,
            "attr_id" => $attr_id,
            "value" => $value,
        ]);
    }
    private function transferFeatures($villaId)
    {
        $features = DB::connection('remote_mysql')
            ->table('villa_features')
            ->where('villa_id', $villaId)
            ->get();

        foreach ($features as $feature) {
            $this->processFeature($feature);
        }
    }

    private function processFeature($feature)
    {
        $featureInfo = DB::connection('remote_mysql')
            ->table('features')
            ->where('id', $feature->feature_id)
            ->first();

        if (!$featureInfo) {
            return;
        }

        $featureTypes = json_decode($featureInfo->model);
        foreach ($featureTypes as $type) {
            $icon = $this->extractIcon($featureInfo->icon);

            $attr = Attr ::firstOrCreate([
                "title" => $featureInfo->name,
                "info" => $icon,
                "attr_type" => "features",
                "post_type" => PostType::getKeyFromValue($type),
            ]);
            $this->createPostHasAttr($attr->id,$feature->value);
        }
    }

    private function transferRulesAndServices($villaId)
    {
        $this->transferRules($villaId);
        $this->transferServices($villaId);
        $this->transferTypes($villaId);
    }

    private function transferRules($villaId)
    {
        $rules = DB::connection('remote_mysql')
            ->table('villa_rules')
            ->where('villa_id', $villaId)
            ->get();

        foreach ($rules as $rule) {
            $this->processRule($rule);
        }
    }

    private function processRule($rule)
    {
        $ruleInfo = DB::connection('remote_mysql')
            ->table('rules')
            ->where('id', $rule->rule_id)
            ->first();

        if (!$ruleInfo) {
            return;
        }

        $ruleTypes = json_decode($ruleInfo->model);
        foreach ($ruleTypes as $type) {
            $icon = $this->extractIcon($ruleInfo->icon);

            $attr = Attr::firstOrCreate([
                "title" => $ruleInfo->name,
                "info" => $icon,
                "attr_type" => "rules",
                "post_type" => PostType::getKeyFromValue($type),
            ]);

            $this->createPostHasAttr($attr->id,$rule->value);
        }
    }

    private function transferServices($villaId)
    {
        $services = DB::connection('remote_mysql')
            ->table('villa_services')
            ->where('villa_id', $villaId)
            ->get();

        if (!$services->count()) {
            return;
        }

        foreach ($services as $service) {
            $serviceInfo = DB::connection('remote_mysql')
                ->table('services')
                ->where('id', $service->service_id)
                ->first();

            if (!$serviceInfo) {
                continue;
            }

            $serviceTypes = json_decode($serviceInfo->model);

            foreach ($serviceTypes as $type) {
                $icon = $this->extractIcon($serviceInfo->icon);

                $attr =  Attr::firstOrCreate([
                    "title" => $serviceInfo->name,
                    "info" => $icon,
                    "attr_type" => "operation",
                    "post_type" => PostType::getKeyFromValue($type),
                ]);
                $this->createPostHasAttr($attr->id,$service->value);
            }
        }
    }

    private function transferTypes($villaId)
    {
        $villaTypes = DB::connection('remote_mysql')
            ->table('villa_typ')
            ->where('villa_id', $villaId)
            ->get();

        if (!$villaTypes->count()) {
            return;
        }

        $mediaRepo = new MediaRepository();
        $mediaService = new MediaService();

        foreach ($villaTypes as $type) {
            $typeInfo = DB::connection('remote_mysql')
                ->table('services')
                ->where('id', $type->typs_id)
                ->first();

            if (!$typeInfo) {
                continue;
            }

            $typeTypes = json_decode($typeInfo->model);
            $mediaId = null;

            // Kapak fotoğrafı işlemi
            if (isset($type->cover_image)) {
                $fileUri = "https://api.tatilmerasi.com/" . $type->cover_image;
                $fileName = Str::slug($type->name);

                $imagePath = $mediaService->downloadAndSave(
                    $fileUri,
                    $fileName,
                    "attrs/category/cover"
                );

                $media = $mediaRepo->create([
                    'url' => $imagePath,
                    'title' => $fileName,
                    'alt' => $fileName,
                    'user_id' => 1,
                ]);

                $mediaId = $media->id;
            }

            foreach ($typeTypes as $villaType) {
                $icon = $this->extractIcon($typeInfo->icon);

                $attr = Attr::firstOrCreate([
                    "title" => $typeInfo->name,
                    "cover" => $mediaId,
                    "info" => $icon,
                    "attr_type" => "category",
                    "post_type" => PostType::getKeyFromValue($villaType),
                ]);

                $this->createPostHasAttr($attr->id,null);
            }
        }
    }

    private function extractIcon($iconPath)
    {
        $iconArr = explode('/', $iconPath);
        $icon = end($iconArr);
        return explode('.', $icon)[0];
    }

    private function getRegionId($villa)
    {
        if ($villa->district_id) {
            $district = DB::connection('remote_mysql')
                ->table('ilceler')
                ->where('id', $villa->district_id)
                ->first();
            return $this->findRegion($district->ilce_adi);
        }

        if ($villa->city_id) {
            $city = DB::connection('remote_mysql')
                ->table('iller')
                ->where('id', $villa->city_id)
                ->first();
            return $this->findRegion($city->il_adi);
        }

        return null;
    }

    private function findRegion(?string $regionName): ?int
    {
        if (empty($regionName)) {
            return null;
        }

        $region = Region::query()
            ->where('slug', 'LIKE', '%' . Str::slug($regionName) . '%')
            ->first();

        return $region?->id;
    }
}
