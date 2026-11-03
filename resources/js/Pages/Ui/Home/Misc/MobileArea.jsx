import React from "react";
import { useTranslation } from "react-i18next";

const MobileArea = () => {
    const { t } = useTranslation();

    return (
        <section className="mobile-area py-12">
            <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">

                <div className="text-center max-w-3xl mx-auto">

                    <div className="title-area">

                        <span className="sub-title style1 text-white">
                            {t('Araç Kiralama Artık Çok Daha Kolay')}
                        </span>

                        <h2 className="sec-title cta-title text-white mt-3">
                            {t('İSTEDİĞİN ARACI SEÇ, HEMEN YOLA ÇIK!')}
                        </h2>

                        <h5 className="sec-title text-white mt-4 leading-relaxed">
                            {t('Geniş araç filomuz, uygun fiyatlarımız ve hızlı rezervasyon sistemimizle ihtiyacınıza en uygun aracı saniyeler içinde kiralayın. İster şehir içi ister uzun yol, her yolculuk için doğru araç burada.')}
                        </h5>

                        <p className="text-white mt-4">
                            {t('Hemen rezervasyon yap, yola çıkmanın keyfini yaşa!')}
                        </p>

                    </div>

                    <div className="btn-group flex flex-col sm:flex-row justify-center mt-6">

                        <a
                            href="/araclar"
                            className="th-btn style6 th-icon flex items-center justify-center me-0 sm:me-2"
                        >
                            {t('Araçları Gör')}
                            <i className="icon arrow-right ms-3" />
                        </a>

                        <a
                            href="/rezervasyon"
                            className="th-btn style6 th-icon flex items-center justify-center mt-2 sm:mt-0"
                        >
                            {t('Hemen Rezervasyon Yap')}
                            <i className="icon arrow-right ms-3" />
                        </a>

                    </div>

                </div>

            </div>
        </section>
    );
};

export default MobileArea;