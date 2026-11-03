import React from "react";
import Header from "../../../Components/UI/Header/Header";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";

const CampaignDetail = () => {
    const { t } = useTranslation();

    return(
        <>
        <Header/>
        <div className="max-w-6xl mx-auto sm:px-2 md:px-2 mt-4 px-4">

      <h1 className="text-2xl font-bold mb-3{">{t('Uzun Konaklama')}</h1>

      <div className="hero">
        <img
          src="/img/about/about-two.webp"
          alt=""
          className="hero-image rounded-lg"
          width={300}  // Resmin yeni genişliği
          height={100} // Resmin yeni yüksekliği
        />
      </div>

      <div className="max-w-10xl my-4 border-2 border-[#e8dcdc77] rounded-[10px] p-[20px] bg-[#0021f409]">
        <h1 className="text-xl mb-5 font-bold">{t('Detaylı Bilgi')}</h1>
        <p className="text-md font-semibold mb-3">{t('Tatilmerası’nda uzun süreli tatil yapmak isteyenlere özel fırsatlar! 7 gece ve üzeri konaklamalarda %7, 14 gece ve üzeri konaklamalarda ise %14 indirim avantajı sunuyoruz. Uzun tatilin keyfini çıkarırken, avantajlı fiyatlarla konaklama fırsatını kaçırmayın. Hem rahatlayın, hem de unutulmaz bir tatil deneyimi yaşayın! Herkesin ihtiyacı olan o uzun tatil için Tatilmerası en doğru adres! Kampanya Kodu: UZUN7 (7 gece ve üzeri) Kampanya Kodu: UZUN14 (14 gece ve üzeri) NOT: Kampanyamız 25 adet stokla sınırlıdır')}</p>
      </div>

      <div className="text-right font-bold mt-5 text-blue-600">
        <Link
          href="#"
          className="inline-flex items-center"
        >
          {t('Tüm Kampanyaları Gör')}
              <span className="ml-2 text-2xl">→</span>
        </Link>
      </div>
    </div>
        </>
    )
}

export default CampaignDetail;
