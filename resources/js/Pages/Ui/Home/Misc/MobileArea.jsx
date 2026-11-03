import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../../../Libs/Routes/config";

const MobileArea = () => {
    const { t } = useTranslation();

    return (
        <div className="cta-band">
            <div className="cta-band-inner">
                <span className="cta-band-eyebrow">
                    {t("Araç Kiralama Artık Çok Daha Kolay")}
                </span>

                <h2 className="cta-band-title">
                    {t("İstediğin aracı seç, hemen yola çık!")}
                </h2>

                <p className="cta-band-text">
                    {t("Geniş araç filomuz, uygun fiyatlarımız ve hızlı rezervasyon sistemimizle ihtiyacınıza en uygun aracı saniyeler içinde kiralayın. İster şehir içi ister uzun yol, her yolculuk için doğru araç burada.")}
                </p>

                <div className="cta-band-actions">
                    <Link to={ROUTES.UI.LISTING} className="cta-btn cta-btn--light">
                        {t("Araçları Gör")}
                        <i className="icon arrow-right" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MobileArea;
