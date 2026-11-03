<?php
namespace App\Providers;
use App\Modules\ContactForm\Providers\ContactFormServiceProvider;
use App\Modules\Notifications\Providers\NotificationsServiceProvider;
use App\Modules\Order\Providers\OrderServiceProvider;
use App\Modules\Policies\Providers\PoliciesServiceProvider;
use App\Modules\Reservation\Models\Reservation;
use App\Modules\Reservation\Observers\ReservationObserver;
use App\Modules\Reservation\Providers\ReservationServiceProvider;
use App\Modules\PopulerRegions\Providers\PopulerRegionsServiceProvider;
use App\Modules\ShowcaseHasPost\Providers\ShowcaseHasPostServiceProvider;
use App\Modules\Showcase\Providers\ShowcaseServiceProvider;
use App\Modules\Faq\Providers\FaqServiceProvider;
use App\Modules\Post\Providers\PostServiceProvider;
use App\Modules\Comment\Providers\CommentServiceProvider;
use App\Modules\Favorite\Providers\FavoriteServiceProvider;
use App\Modules\Coupon\Providers\CouponServiceProvider;
use App\Modules\Campaign\Providers\CampaignServiceProvider;
use App\Modules\Seo\Providers\SeoServiceProvider;
use App\Modules\Media\Providers\MediaServiceProvider;
use App\Modules\Blog\Providers\BlogServiceProvider;
use App\Modules\PostHasAttr\Providers\PostHasAttrServiceProvider;
use App\Modules\Attr\Providers\AttrServiceProvider;
use App\Modules\User\Models\User;
use App\Modules\User\Observers\UserObserver;
use App\Modules\User\Providers\UserServiceProvider;
use App\Modules\KmPaketleri\Providers\KmPaketleriServiceProvider;
use App\Modules\Reference\Providers\ReferenceServiceProvider;
use App\Services\NetGSMService;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
    // Register services
        $this->app->register(ContactFormServiceProvider::class);
    // Register services
        $this->app->register(ReservationServiceProvider::class);
    // Register services
        $this->app->register(OrderServiceProvider::class);
    // Register services
        $this->app->register(PopulerRegionsServiceProvider::class);
    // Register services
        $this->app->register(ShowcaseHasPostServiceProvider::class);
    // Register services
        $this->app->register(ShowcaseServiceProvider::class);
    // Register services
        $this->app->register(FaqServiceProvider::class);
    // Register services
        $this->app->register(PostServiceProvider::class);
    // Register services
        $this->app->register(CommentServiceProvider::class);
    // Register services
        $this->app->register(FavoriteServiceProvider::class);
    // Register services
    // Register services
        $this->app->register(CouponServiceProvider::class);
    // Register services
        $this->app->register(CampaignServiceProvider::class);
    // Register services
        $this->app->register(SeoServiceProvider::class);
    // Register services
        $this->app->register(MediaServiceProvider::class);
    // Register services
        $this->app->register(BlogServiceProvider::class);
    // Register services
        $this->app->register(PostHasAttrServiceProvider::class);
    // Register services
        $this->app->register(AttrServiceProvider::class);
    // Register services
        $this->app->register(UserServiceProvider::class);
    // Register services
        $this->app->register(NotificationsServiceProvider::class);
    // Register services
        $this->app->register(PoliciesServiceProvider::class);
        $this->app->register(KmPaketleriServiceProvider::class);
        $this->app->register(ReferenceServiceProvider::class);
        Schema::defaultStringLength(191);
    }
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        User::observe(new UserObserver(app(NetGSMService::class)));
        // 💥 Rezervasyon observer'ını bağla
        Reservation::observe(new ReservationObserver(app(NetGSMService::class)));
    }
}
