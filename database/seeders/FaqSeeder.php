<?php

namespace Database\Seeders;

use App\Modules\Faq\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // FAQ'ları ekliyoruz
        Faq::create([
            'question' => 'Tourency nedir?',
            'answer' => 'Tourency, seyahat ve tatil planlamanızı kolaylaştırmak için kullanılan bir platformdur.',
        ]);

        Faq::create([
            'question' => 'Nasıl rezervasyon yapabilirim?',
            'answer' => 'Web sitemiz üzerinden istediğiniz tatil seçeneğini seçip rezervasyon yapabilirsiniz.',
        ]);

        Faq::create([
            'question' => 'Ödeme yöntemleri nelerdir?',
            'answer' => 'Kredi kartı, banka havalesi ve PayPal ile ödeme yapabilirsiniz.',
        ]);

        Faq::create([
            'question' => 'İptal ve iade politikası nedir?',
            'answer' => 'Rezervasyonunuzu iptal edebilirsiniz, ancak belirli bir süre önceden yapılmalıdır. İade politikamız için web sitemizdeki ilgili sayfaya göz atabilirsiniz.',
        ]);

        Faq::create([
            'question' => 'Hangi bölgelerde hizmet veriyorsunuz?',
            'answer' => 'Türkiye genelinde ve dünya çapında birçok tatil bölgesinde hizmet veriyoruz.',
        ]);
    }
}
